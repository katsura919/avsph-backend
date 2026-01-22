import type { FastifyPluginAsync } from 'fastify';
import userRoutes from '../modules/user/user.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import businessRoutes from '../modules/business/business.routes.js';
import blogRoutes from '../modules/blog/blog.routes.js';
import applicantRoutes from '../modules/applicant/applicant.routes.js';
import staffRoutes from '../modules/staff/staff.routes.js';

// Central routes aggregator - register all module routes here
const routes: FastifyPluginAsync = async (fastify) => {
    // Admin auth routes
    await fastify.register(adminRoutes);

    // User/Staff routes
    await fastify.register(userRoutes);

    // Business routes
    await fastify.register(businessRoutes);

    // Blog routes
    await fastify.register(blogRoutes);

    // Applicant routes
    await fastify.register(applicantRoutes);

    // Staff routes
    await fastify.register(staffRoutes);
};

export default routes;

