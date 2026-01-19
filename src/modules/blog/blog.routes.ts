import type { FastifyPluginAsync } from 'fastify';
import {
    blogJsonSchema,
    createBlogJsonSchema,
    updateBlogJsonSchema,
} from '../../types/blog.types.js';
import {
    getAllBlogs,
    getBlogById,
    getBlogBySlug,
    getBlogsByBusiness,
    createBlog,
    updateBlog,
    deleteBlog,
} from './blog.controllers.js';

const blogRoutes: FastifyPluginAsync = async (fastify) => {
    // GET /blogs - Get all blogs (with optional filters)
    fastify.get('/blogs', {
        schema: {
            description: 'Get all blogs with optional filters',
            tags: ['Blogs'],
            querystring: {
                type: 'object',
                properties: {
                    businessId: { type: 'string', description: 'Filter by business ID' },
                    status: { type: 'string', enum: ['draft', 'published'], description: 'Filter by status' },
                },
            },
            response: {
                200: {
                    type: 'array',
                    items: blogJsonSchema,
                },
            },
        },
    }, getAllBlogs);

    // GET /blogs/:id - Get blog by ID
    fastify.get<{ Params: { id: string } }>('/blogs/:id', {
        schema: {
            description: 'Get a blog by ID',
            tags: ['Blogs'],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'Blog ID (MongoDB ObjectId)' },
                },
                required: ['id'],
            },
            response: {
                200: blogJsonSchema,
                404: {
                    type: 'object',
                    properties: { error: { type: 'string' } },
                },
            },
        },
    }, getBlogById);

    // GET /blogs/slug/:slug - Get blog by slug (public)
    fastify.get<{ Params: { slug: string } }>('/blogs/slug/:slug', {
        schema: {
            description: 'Get a published blog by slug',
            tags: ['Blogs'],
            params: {
                type: 'object',
                properties: {
                    slug: { type: 'string', description: 'Blog slug' },
                },
                required: ['slug'],
            },
            response: {
                200: blogJsonSchema,
                404: {
                    type: 'object',
                    properties: { error: { type: 'string' } },
                },
            },
        },
    }, getBlogBySlug);

    // GET /businesses/:businessId/blogs - Get blogs by business
    fastify.get<{ Params: { businessId: string } }>('/businesses/:businessId/blogs', {
        schema: {
            description: 'Get all published blogs for a business',
            tags: ['Blogs'],
            params: {
                type: 'object',
                properties: {
                    businessId: { type: 'string', description: 'Business ID (MongoDB ObjectId)' },
                },
                required: ['businessId'],
            },
            response: {
                200: {
                    type: 'array',
                    items: blogJsonSchema,
                },
            },
        },
    }, getBlogsByBusiness);

    // POST /blogs - Create blog (protected)
    fastify.post('/blogs', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Create a new blog',
            tags: ['Blogs'],
            security: [{ bearerAuth: [] }],
            body: createBlogJsonSchema,
            response: {
                201: blogJsonSchema,
                400: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                        details: { type: 'array' },
                    },
                },
                404: {
                    type: 'object',
                    properties: { error: { type: 'string' } },
                },
                409: {
                    type: 'object',
                    properties: { error: { type: 'string' } },
                },
            },
        },
    }, createBlog);

    // PUT /blogs/:id - Update blog (protected)
    fastify.put<{ Params: { id: string } }>('/blogs/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Update a blog',
            tags: ['Blogs'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'Blog ID (MongoDB ObjectId)' },
                },
                required: ['id'],
            },
            body: updateBlogJsonSchema,
            response: {
                200: blogJsonSchema,
                400: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                        details: { type: 'array' },
                    },
                },
                404: {
                    type: 'object',
                    properties: { error: { type: 'string' } },
                },
                409: {
                    type: 'object',
                    properties: { error: { type: 'string' } },
                },
            },
        },
    }, updateBlog);

    // DELETE /blogs/:id - Soft delete blog (protected)
    fastify.delete<{ Params: { id: string } }>('/blogs/:id', {
        preHandler: [fastify.authenticate],
        schema: {
            description: 'Soft delete a blog',
            tags: ['Blogs'],
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', description: 'Blog ID (MongoDB ObjectId)' },
                },
                required: ['id'],
            },
            response: {
                200: {
                    type: 'object',
                    properties: { message: { type: 'string' } },
                },
                404: {
                    type: 'object',
                    properties: { error: { type: 'string' } },
                },
            },
        },
    }, deleteBlog);
};

export default blogRoutes;
