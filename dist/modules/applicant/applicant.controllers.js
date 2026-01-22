import { ObjectId } from "@fastify/mongodb";
import { createApplicantSchema, updateApplicantSchema, } from "../../types/applicant.types.js";
// Get all applicants (protected - filtered by business access)
export async function getAllApplicants(request, reply) {
    const applicants = request.server.mongo.db?.collection("applicants");
    const businesses = request.server.mongo.db?.collection("businesses");
    if (!applicants || !businesses) {
        return reply.status(500).send({ error: "Database not available" });
    }
    const query = { isActive: true };
    // Filter by business if provided
    if (request.query.businessId) {
        if (!ObjectId.isValid(request.query.businessId)) {
            return reply.status(400).send({ error: "Invalid business ID format" });
        }
        query.businessId = request.query.businessId;
    }
    // Filter by status if provided
    if (request.query.status) {
        query.status = request.query.status;
    }
    // If not super-admin, filter by accessible businesses
    if (request.user.role !== "super-admin") {
        const accessibleBusinesses = await businesses
            .find({ adminIds: request.user.id, isActive: true })
            .project({ _id: 1 })
            .toArray();
        const businessIds = accessibleBusinesses.map((b) => b._id.toString());
        if (query.businessId && !businessIds.includes(query.businessId)) {
            return reply.status(403).send({
                error: "Forbidden",
                message: "You do not have access to this business",
            });
        }
        if (!query.businessId) {
            query.businessId = { $in: businessIds };
        }
    }
    const result = await applicants.find(query).sort({ createdAt: -1 }).toArray();
    return result;
}
// Get applicant by ID (protected)
export async function getApplicantById(request, reply) {
    const applicants = request.server.mongo.db?.collection("applicants");
    const businesses = request.server.mongo.db?.collection("businesses");
    if (!applicants || !businesses) {
        return reply.status(500).send({ error: "Database not available" });
    }
    const { id } = request.params;
    if (!ObjectId.isValid(id)) {
        return reply.status(400).send({ error: "Invalid applicant ID format" });
    }
    const applicant = await applicants.findOne({ _id: new ObjectId(id) });
    if (!applicant) {
        return reply.status(404).send({ error: "Applicant not found" });
    }
    // Check business access (unless super-admin)
    if (request.user.role !== "super-admin") {
        const business = await businesses.findOne({
            _id: new ObjectId(applicant.businessId),
            adminIds: request.user.id,
        });
        if (!business) {
            return reply.status(403).send({
                error: "Forbidden",
                message: "You do not have access to this applicant's business",
            });
        }
    }
    return applicant;
}
// Get applicants by business (protected)
export async function getApplicantsByBusiness(request, reply) {
    const applicants = request.server.mongo.db?.collection("applicants");
    const businesses = request.server.mongo.db?.collection("businesses");
    if (!applicants || !businesses) {
        return reply.status(500).send({ error: "Database not available" });
    }
    const { businessId } = request.params;
    if (!ObjectId.isValid(businessId)) {
        return reply.status(400).send({ error: "Invalid business ID format" });
    }
    // Check business access (unless super-admin)
    if (request.user.role !== "super-admin") {
        const business = await businesses.findOne({
            _id: new ObjectId(businessId),
            adminIds: request.user.id,
        });
        if (!business) {
            return reply.status(403).send({
                error: "Forbidden",
                message: "You do not have access to this business",
            });
        }
    }
    const result = await applicants
        .find({ businessId, isActive: true })
        .sort({ createdAt: -1 })
        .toArray();
    return result;
}
// Create applicant (PUBLIC - for job applications)
export async function createApplicant(request, reply) {
    const applicants = request.server.mongo.db?.collection("applicants");
    const businesses = request.server.mongo.db?.collection("businesses");
    if (!applicants || !businesses) {
        return reply.status(500).send({ error: "Database not available" });
    }
    const parseResult = createApplicantSchema.safeParse(request.body);
    if (!parseResult.success) {
        return reply.status(400).send({
            error: "Validation failed",
            details: parseResult.error.errors,
        });
    }
    const { firstName, lastName, email, phone, position, resumeUrl, coverLetter, businessId, } = parseResult.data;
    // Validate business exists
    if (!ObjectId.isValid(businessId)) {
        return reply.status(400).send({ error: "Invalid business ID format" });
    }
    const business = await businesses.findOne({
        _id: new ObjectId(businessId),
        isActive: true,
    });
    if (!business) {
        return reply.status(404).send({ error: "Business not found" });
    }
    const now = new Date().toISOString();
    const newApplicant = {
        firstName,
        lastName,
        email,
        phone,
        position,
        resumeUrl,
        coverLetter,
        businessId,
        status: "pending",
        notes: undefined,
        isActive: true,
        appliedAt: now,
        createdAt: now,
        updatedAt: now,
    };
    const result = await applicants.insertOne(newApplicant);
    return reply.status(201).send({
        _id: result.insertedId,
        ...newApplicant,
    });
}
// Update applicant (protected - admin only)
export async function updateApplicant(request, reply) {
    const applicants = request.server.mongo.db?.collection("applicants");
    const businesses = request.server.mongo.db?.collection("businesses");
    if (!applicants || !businesses) {
        return reply.status(500).send({ error: "Database not available" });
    }
    const { id } = request.params;
    if (!ObjectId.isValid(id)) {
        return reply.status(400).send({ error: "Invalid applicant ID format" });
    }
    // Get the applicant to check business access
    const existingApplicant = await applicants.findOne({ _id: new ObjectId(id) });
    if (!existingApplicant) {
        return reply.status(404).send({ error: "Applicant not found" });
    }
    // Check if admin has access to the applicant's business (unless super-admin)
    if (request.user.role !== "super-admin") {
        const business = await businesses.findOne({
            _id: new ObjectId(existingApplicant.businessId),
            adminIds: request.user.id,
        });
        if (!business) {
            return reply.status(403).send({
                error: "Forbidden",
                message: "You do not have access to this applicant's business",
            });
        }
    }
    const parseResult = updateApplicantSchema.safeParse(request.body);
    if (!parseResult.success) {
        return reply.status(400).send({
            error: "Validation failed",
            details: parseResult.error.errors,
        });
    }
    const updateData = {
        ...parseResult.data,
        updatedAt: new Date().toISOString(),
    };
    const result = await applicants.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: "after" });
    if (!result) {
        return reply.status(404).send({ error: "Applicant not found" });
    }
    return result;
}
// Delete applicant (soft delete - protected)
export async function deleteApplicant(request, reply) {
    const applicants = request.server.mongo.db?.collection("applicants");
    const businesses = request.server.mongo.db?.collection("businesses");
    if (!applicants || !businesses) {
        return reply.status(500).send({ error: "Database not available" });
    }
    const { id } = request.params;
    if (!ObjectId.isValid(id)) {
        return reply.status(400).send({ error: "Invalid applicant ID format" });
    }
    // Get the applicant to check business access
    const existingApplicant = await applicants.findOne({ _id: new ObjectId(id) });
    if (!existingApplicant) {
        return reply.status(404).send({ error: "Applicant not found" });
    }
    // Check if admin has access (unless super-admin)
    if (request.user.role !== "super-admin") {
        const business = await businesses.findOne({
            _id: new ObjectId(existingApplicant.businessId),
            adminIds: request.user.id,
        });
        if (!business) {
            return reply.status(403).send({
                error: "Forbidden",
                message: "You do not have access to this applicant's business",
            });
        }
    }
    const result = await applicants.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { isActive: false, updatedAt: new Date().toISOString() } }, { returnDocument: "after" });
    if (!result) {
        return reply.status(404).send({ error: "Applicant not found" });
    }
    return reply.status(200).send({ message: "Applicant deleted successfully" });
}
// Upload applicant resume (can be public or protected based on use case)
export async function uploadApplicantResume(request, reply) {
    const applicants = request.server.mongo.db?.collection("applicants");
    if (!applicants) {
        return reply.status(500).send({ error: "Database not available" });
    }
    const { id } = request.params;
    if (!ObjectId.isValid(id)) {
        return reply.status(400).send({ error: "Invalid applicant ID format" });
    }
    // Check if applicant exists
    const applicant = await applicants.findOne({ _id: new ObjectId(id) });
    if (!applicant) {
        return reply.status(404).send({ error: "Applicant not found" });
    }
    try {
        // Get the uploaded file
        const data = await request.file();
        if (!data) {
            return reply.status(400).send({ error: "No file uploaded" });
        }
        // Validate file type (allow documents and images)
        const allowedMimeTypes = [
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpeg",
            "image/png",
        ];
        if (!allowedMimeTypes.includes(data.mimetype)) {
            return reply.status(400).send({
                error: "Invalid file type. Allowed types: PDF, DOC, DOCX, JPEG, PNG",
            });
        }
        // Convert file stream to buffer
        const chunks = [];
        for await (const chunk of data.file) {
            chunks.push(chunk);
        }
        const fileBuffer = Buffer.concat(chunks);
        // Upload to Cloudinary
        const uploadResult = await request.server.uploadToCloudinary(fileBuffer, {
            folder: `applicants/${applicant.businessId}/${id}`,
            public_id: `resume_${Date.now()}`,
            resource_type: "auto",
        });
        // Update applicant with resume URL
        const result = await applicants.findOneAndUpdate({ _id: new ObjectId(id) }, {
            $set: {
                resumeUrl: uploadResult.secure_url,
                updatedAt: new Date().toISOString(),
            },
        }, { returnDocument: "after" });
        return reply.status(200).send({
            message: "Resume uploaded successfully",
            resumeUrl: uploadResult.secure_url,
            applicant: result,
        });
    }
    catch (error) {
        request.server.log.error(error);
        return reply.status(500).send({
            error: "Failed to upload resume",
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
}
//# sourceMappingURL=applicant.controllers.js.map