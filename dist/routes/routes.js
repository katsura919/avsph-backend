import userRoutes from '../modules/user/user.routes.js';
import adminRoutes from '../modules/admin/admin.routes.js';
import businessRoutes from '../modules/business/business.routes.js';
import blogRoutes from '../modules/blog/blog.routes.js';
// Central routes aggregator - register all module routes here
const routes = async (fastify) => {
    // Admin auth routes
    await fastify.register(adminRoutes);
    // User/Staff routes
    await fastify.register(userRoutes);
    // Business routes
    await fastify.register(businessRoutes);
    // Blog routes
    await fastify.register(blogRoutes);
};
export default routes;
//# sourceMappingURL=routes.js.map