import type { FastifyRequest, FastifyReply } from "fastify";
import { ObjectId } from "@fastify/mongodb";
import bcrypt from "bcrypt";
import {
    staffLoginSchema,
    staffChangePasswordSchema,
    type StaffLogin,
    type StaffChangePassword,
} from "../../types/staff.types.js";

// Staff login
export async function loginStaff(
    request: FastifyRequest<{ Body: StaffLogin }>,
    reply: FastifyReply,
) {
    const staff = request.server.mongo.db?.collection("staff");
    const businesses = request.server.mongo.db?.collection("businesses");

    if (!staff || !businesses) {
        return reply.status(500).send({ error: "Database not available" });
    }

    const parseResult = staffLoginSchema.safeParse(request.body);

    if (!parseResult.success) {
        return reply.status(400).send({
            error: "Validation failed",
            details: parseResult.error.errors,
        });
    }

    const { email, password, businessId } = parseResult.data;

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

    // Find staff member in the specified business
    const staffMember = await staff.findOne({
        email,
        businessId,
        isActive: true,
        status: "active",
    });

    if (!staffMember) {
        return reply.status(401).send({ error: "Invalid email or password" });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, staffMember.password);

    if (!isValidPassword) {
        return reply.status(401).send({ error: "Invalid email or password" });
    }

    // Generate JWT token with staff-specific payload
    const token = request.server.jwt.sign({
        id: staffMember._id.toString(),
        email: staffMember.email,
        role: "staff",
        userType: "staff",
        businessId: staffMember.businessId,
    });

    // Remove password from response
    const { password: _, ...staffWithoutPassword } = staffMember;

    return {
        token,
        staff: {
            ...staffWithoutPassword,
            _id: staffMember._id.toString(),
        },
    };
}

// Get current staff (from JWT)
export async function getCurrentStaff(
    request: FastifyRequest,
    reply: FastifyReply,
) {
    const staff = request.server.mongo.db?.collection("staff");

    if (!staff) {
        return reply.status(500).send({ error: "Database not available" });
    }

    const { id } = request.user;

    if (!ObjectId.isValid(id)) {
        return reply.status(400).send({ error: "Invalid staff ID" });
    }

    const staffMember = await staff.findOne({ _id: new ObjectId(id) });

    if (!staffMember) {
        return reply.status(404).send({ error: "Staff member not found" });
    }

    // Remove password from response
    const { password, ...staffWithoutPassword } = staffMember;
    return staffWithoutPassword;
}

// Change staff password
export async function changeStaffPassword(
    request: FastifyRequest<{ Body: StaffChangePassword }>,
    reply: FastifyReply,
) {
    const staff = request.server.mongo.db?.collection("staff");

    if (!staff) {
        return reply.status(500).send({ error: "Database not available" });
    }

    const { id } = request.user;

    if (!ObjectId.isValid(id)) {
        return reply.status(400).send({ error: "Invalid staff ID" });
    }

    const parseResult = staffChangePasswordSchema.safeParse(request.body);

    if (!parseResult.success) {
        return reply.status(400).send({
            error: "Validation failed",
            details: parseResult.error.errors,
        });
    }

    const { currentPassword, newPassword } = parseResult.data;

    // Get current staff member
    const staffMember = await staff.findOne({ _id: new ObjectId(id) });

    if (!staffMember) {
        return reply.status(404).send({ error: "Staff member not found" });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, staffMember.password);

    if (!isValidPassword) {
        return reply.status(401).send({ error: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await staff.findOneAndUpdate(
        { _id: new ObjectId(id) },
        {
            $set: {
                password: hashedPassword,
                updatedAt: new Date().toISOString(),
            },
        },
    );

    return { message: "Password changed successfully" };
}
