import type { FastifyRequest, FastifyReply } from "fastify";
interface IdParams {
    id: string;
}
interface BusinessIdParams {
    businessId: string;
}
interface ApplicantQuery {
    businessId?: string;
    status?: string;
}
export declare function getAllApplicants(request: FastifyRequest<{
    Querystring: ApplicantQuery;
}>, reply: FastifyReply): Promise<import("mongodb").WithId<import("bson").Document>[]>;
export declare function getApplicantById(request: FastifyRequest<{
    Params: IdParams;
}>, reply: FastifyReply): Promise<import("mongodb").WithId<import("bson").Document>>;
export declare function getApplicantsByBusiness(request: FastifyRequest<{
    Params: BusinessIdParams;
}>, reply: FastifyReply): Promise<import("mongodb").WithId<import("bson").Document>[]>;
export declare function createApplicant(request: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function updateApplicant(request: FastifyRequest<{
    Params: IdParams;
}>, reply: FastifyReply): Promise<import("mongodb").WithId<import("bson").Document>>;
export declare function deleteApplicant(request: FastifyRequest<{
    Params: IdParams;
}>, reply: FastifyReply): Promise<never>;
export declare function uploadApplicantResume(request: FastifyRequest<{
    Params: IdParams;
}>, reply: FastifyReply): Promise<never>;
export {};
//# sourceMappingURL=applicant.controllers.d.ts.map