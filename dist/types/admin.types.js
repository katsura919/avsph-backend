import { z } from 'zod';
// Admin schema for validation
export const adminSchema = z.object({
    _id: z.string().optional(),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    isActive: z.boolean().default(true),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});
// Schema for creating admin
export const createAdminSchema = adminSchema.omit({
    _id: true,
    createdAt: true,
    updatedAt: true,
});
// Schema for login
export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});
// JSON Schemas for Fastify
export const adminJsonSchema = {
    type: 'object',
    properties: {
        _id: { type: 'string' },
        email: { type: 'string', format: 'email' },
        firstName: { type: 'string', minLength: 1, maxLength: 50 },
        lastName: { type: 'string', minLength: 1, maxLength: 50 },
        isActive: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['email', 'firstName', 'lastName'],
};
export const createAdminJsonSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 },
        firstName: { type: 'string', minLength: 1, maxLength: 50 },
        lastName: { type: 'string', minLength: 1, maxLength: 50 },
    },
    required: ['email', 'password', 'firstName', 'lastName'],
};
export const loginJsonSchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 1 },
    },
    required: ['email', 'password'],
};
export const loginResponseJsonSchema = {
    type: 'object',
    properties: {
        token: { type: 'string' },
        admin: adminJsonSchema,
    },
    required: ['token', 'admin'],
};
//# sourceMappingURL=admin.types.js.map