import type { FastifyPluginAsync } from 'fastify';
declare module 'fastify' {
    interface FastifyInstance {
        authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    }
}
declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: {
            id: string;
            email: string;
        };
        user: {
            id: string;
            email: string;
        };
    }
}
declare const _default: FastifyPluginAsync;
export default _default;
//# sourceMappingURL=auth.d.ts.map