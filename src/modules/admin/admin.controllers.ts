import type { FastifyRequest, FastifyReply } from 'fastify';
import { ObjectId } from '@fastify/mongodb';
import bcrypt from 'bcrypt';
import { createAdminSchema, loginSchema } from '../../types/admin.types.js';
import type { CreateAdmin, LoginRequest } from '../../types/admin.types.js';

// Login admin
export async function loginAdmin(
    request: FastifyRequest<{ Body: LoginRequest }>,
    reply: FastifyReply
) {
    const admins = request.server.mongo.db?.collection('admins');

    if (!admins) {
        return reply.status(500).send({ error: 'Database not available' });
    }

    const parseResult = loginSchema.safeParse(request.body);

    if (!parseResult.success) {
        return reply.status(400).send({
            error: 'Validation failed',
            details: parseResult.error.errors,
        });
    }

    const { email, password } = parseResult.data;

    const admin = await admins.findOne({ email, isActive: true });

    if (!admin) {
        return reply.status(401).send({ error: 'Invalid email or password' });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
        return reply.status(401).send({ error: 'Invalid email or password' });
    }

    const token = request.server.jwt.sign({
        id: admin._id.toString(),
        email: admin.email,
    });

    const { password: _, ...adminWithoutPassword } = admin;

    return {
        token,
        admin: adminWithoutPassword,
    };
}

// Get current admin
export async function getCurrentAdmin(request: FastifyRequest, reply: FastifyReply) {
    const admins = request.server.mongo.db?.collection('admins');

    if (!admins) {
        return reply.status(500).send({ error: 'Database not available' });
    }

    const { id } = request.user;

    if (!ObjectId.isValid(id)) {
        return reply.status(400).send({ error: 'Invalid admin ID' });
    }

    const admin = await admins.findOne({ _id: new ObjectId(id) });

    if (!admin) {
        return reply.status(404).send({ error: 'Admin not found' });
    }

    const { password, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
}

// Create admin (for initial setup)
export async function createAdmin(
    request: FastifyRequest<{ Body: CreateAdmin }>,
    reply: FastifyReply
) {
    const admins = request.server.mongo.db?.collection('admins');

    if (!admins) {
        return reply.status(500).send({ error: 'Database not available' });
    }

    const parseResult = createAdminSchema.safeParse(request.body);

    if (!parseResult.success) {
        return reply.status(400).send({
            error: 'Validation failed',
            details: parseResult.error.errors,
        });
    }

    const { email, password, firstName, lastName } = parseResult.data;

    // Check if email already exists
    const existingAdmin = await admins.findOne({ email });
    if (existingAdmin) {
        return reply.status(409).send({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const now = new Date().toISOString();
    const newAdmin = {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        isActive: true,
        createdAt: now,
        updatedAt: now,
    };

    const result = await admins.insertOne(newAdmin);

    const { password: _, ...responseAdmin } = newAdmin;

    return reply.status(201).send({
        _id: result.insertedId,
        ...responseAdmin,
    });
}
