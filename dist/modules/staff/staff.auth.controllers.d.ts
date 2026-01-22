import type { FastifyRequest, FastifyReply } from "fastify";
import { ObjectId } from "@fastify/mongodb";
import { type StaffLogin, type StaffChangePassword } from "../../types/staff.types.js";
export declare function loginStaff(request: FastifyRequest<{
    Body: StaffLogin;
}>, reply: FastifyReply): Promise<{
    token: string;
    staff: {
        _id: string;
    };
}>;
export declare function getCurrentStaff(request: FastifyRequest, reply: FastifyReply): Promise<{
    [key: string]: any;
    _id: ObjectId;
}>;
export declare function changeStaffPassword(request: FastifyRequest<{
    Body: StaffChangePassword;
}>, reply: FastifyReply): Promise<{
    message: string;
}>;
//# sourceMappingURL=staff.auth.controllers.d.ts.map