import userRoutes from '../modules/user/user.routes.js';
// Central routes aggregator - register all module routes here
const routes = async (fastify) => {
    // User/Staff routes
    await fastify.register(userRoutes);
    // Add more module routes here as the app grows
    // await fastify.register(clientRoutes);
    // await fastify.register(jobRoutes);
};
export default routes;
//# sourceMappingURL=routes.js.map