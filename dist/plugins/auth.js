import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
const authPlugin = async (fastify) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is required');
    }
    await fastify.register(jwt, {
        secret,
        sign: {
            expiresIn: '7d',
        },
    });
    fastify.decorate('authenticate', async function (request, reply) {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            reply.status(401).send({ error: 'Unauthorized', message: 'Invalid or expired token' });
        }
    });
};
export default fp(authPlugin, {
    name: 'auth',
});
//# sourceMappingURL=auth.js.map