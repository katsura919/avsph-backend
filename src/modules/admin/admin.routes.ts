import type { FastifyPluginAsync } from 'fastify';
import {
    adminJsonSchema,
    createAdminJsonSchema,
    loginJsonSchema,
    loginResponseJsonSchema,
} from '../../types/admin.types.js';
import { loginAdmin, getCurrentAdmin, createAdmin } from './admin.controllers.js';

const adminRoutes: FastifyPluginAsync = async (fastify) => {
    // POST /admin/login - Login
    fastify.post('/admin/login', {
        schema: {
            description: 'Admin login',
            tags: ['Admin'],
            body: loginJsonSchema,
            response: {
                200: loginResponseJsonSchema,
                400: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                        details: { type: 'array' },
                    },
                },
                401: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                    },
                },
            },
        },
    }, loginAdmin);

    // GET /admin/me - Get current admin (protected)
    fastify.get('/admin/me', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Get current authenticated admin',
            tags: ['Admin'],
            security: [{ bearerAuth: [] }],
            response: {
                200: adminJsonSchema,
                401: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                        message: { type: 'string' },
                    },
                },
                404: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                    },
                },
            },
        },
    }, getCurrentAdmin);

    // POST /admin/register - Create admin (for initial setup)
    fastify.post('/admin/register', {
        schema: {
            description: 'Register a new admin',
            tags: ['Admin'],
            body: createAdminJsonSchema,
            response: {
                201: adminJsonSchema,
                400: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                        details: { type: 'array' },
                    },
                },
                409: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                    },
                },
            },
        },
    }, createAdmin);
};

export default adminRoutes;
