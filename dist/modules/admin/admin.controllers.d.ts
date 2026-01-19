import type { FastifyRequest, FastifyReply } from 'fastify';
import { ObjectId } from '@fastify/mongodb';
import type { CreateAdmin, LoginRequest } from '../../types/admin.types.js';
export declare function loginAdmin(request: FastifyRequest<{
    Body: LoginRequest;
}>, reply: FastifyReply): Promise<{
    token: string;
    admin: {
        [key: string]: any;
        _id: ObjectId;
    };
}>;
export declare function getCurrentAdmin(request: FastifyRequest, reply: FastifyReply): Promise<{
    [key: string]: any;
    _id: ObjectId;
}>;
export declare function createAdmin(request: FastifyRequest<{
    Body: CreateAdmin;
}>, reply: FastifyReply): Promise<never>;
//# sourceMappingURL=admin.controllers.d.ts.map