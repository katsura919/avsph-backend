import { ObjectId } from '@fastify/mongodb';
import { createBusinessSchema, updateBusinessSchema } from '../../types/business.types.js';
// Get all businesses
export async function getAllBusinesses(request, reply) {
    const businesses = request.server.mongo.db?.collection('businesses');
    if (!businesses) {
        return reply.status(500).send({ error: 'Database not available' });
    }
    const result = await businesses.find({ isActive: true }).toArray();
    return result;
}
// Get business by ID
export async function getBusinessById(request, reply) {
    const businesses = request.server.mongo.db?.collection('businesses');
    if (!businesses) {
        return reply.status(500).send({ error: 'Database not available' });
    }
    const { id } = request.params;
    if (!ObjectId.isValid(id)) {
        return reply.status(400).send({ error: 'Invalid business ID format' });
    }
    const business = await businesses.findOne({ _id: new ObjectId(id) });
    if (!business) {
        return reply.status(404).send({ error: 'Business not found' });
    }
    return business;
}
// Get business by slug
export async function getBusinessBySlug(request, reply) {
    const businesses = request.server.mongo.db?.collection('businesses');
    if (!businesses) {
        return reply.status(500).send({ error: 'Database not available' });
    }
    const { slug } = request.params;
    const business = await businesses.findOne({ slug, isActive: true });
    if (!business) {
        return reply.status(404).send({ error: 'Business not found' });
    }
    return business;
}
// Create business
export async function createBusiness(request, reply) {
    const businesses = request.server.mongo.db?.collection('businesses');
    if (!businesses) {
        return reply.status(500).send({ error: 'Database not available' });
    }
    const parseResult = createBusinessSchema.safeParse(request.body);
    if (!parseResult.success) {
        return reply.status(400).send({
            error: 'Validation failed',
            details: parseResult.error.errors,
        });
    }
    const { name, slug, description, logo, website, isActive = true } = parseResult.data;
    // Check if slug already exists
    const existingBusiness = await businesses.findOne({ slug });
    if (existingBusiness) {
        return reply.status(409).send({ error: 'Slug already exists' });
    }
    const now = new Date().toISOString();
    const newBusiness = {
        name,
        slug,
        description,
        logo,
        website,
        isActive,
        createdAt: now,
        updatedAt: now,
    };
    const result = await businesses.insertOne(newBusiness);
    return reply.status(201).send({
        _id: result.insertedId,
        ...newBusiness,
    });
}
// Update business
export async function updateBusiness(request, reply) {
    const businesses = request.server.mongo.db?.collection('businesses');
    if (!businesses) {
        return reply.status(500).send({ error: 'Database not available' });
    }
    const { id } = request.params;
    if (!ObjectId.isValid(id)) {
        return reply.status(400).send({ error: 'Invalid business ID format' });
    }
    const parseResult = updateBusinessSchema.safeParse(request.body);
    if (!parseResult.success) {
        return reply.status(400).send({
            error: 'Validation failed',
            details: parseResult.error.errors,
        });
    }
    // Check if slug is being updated and already exists
    if (parseResult.data.slug) {
        const existingBusiness = await businesses.findOne({
            slug: parseResult.data.slug,
            _id: { $ne: new ObjectId(id) },
        });
        if (existingBusiness) {
            return reply.status(409).send({ error: 'Slug already exists' });
        }
    }
    const updateData = {
        ...parseResult.data,
        updatedAt: new Date().toISOString(),
    };
    const result = await businesses.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updateData }, { returnDocument: 'after' });
    if (!result) {
        return reply.status(404).send({ error: 'Business not found' });
    }
    return result;
}
// Delete business (soft delete)
export async function deleteBusiness(request, reply) {
    const businesses = request.server.mongo.db?.collection('businesses');
    if (!businesses) {
        return reply.status(500).send({ error: 'Database not available' });
    }
    const { id } = request.params;
    if (!ObjectId.isValid(id)) {
        return reply.status(400).send({ error: 'Invalid business ID format' });
    }
    const result = await businesses.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { isActive: false, updatedAt: new Date().toISOString() } }, { returnDocument: 'after' });
    if (!result) {
        return reply.status(404).send({ error: 'Business not found' });
    }
    return reply.status(200).send({ message: 'Business deleted successfully' });
}
//# sourceMappingURL=business.controllers.js.map