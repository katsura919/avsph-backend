import type { FastifyRequest, FastifyReply } from "fastify";
interface IdParams {
    id: string;
}
interface SlugParams {
    slug: string;
}
interface BusinessIdParams {
    businessId: string;
}
interface BlogQuery {
    businessId?: string;
    status?: "draft" | "published";
}
export declare function getAllBlogs(request: FastifyRequest<{
    Querystring: BlogQuery;
}>, reply: FastifyReply): Promise<import("mongodb").WithId<import("bson").Document>[]>;
export declare function getBlogById(request: FastifyRequest<{
    Params: IdParams;
}>, reply: FastifyReply): Promise<import("mongodb").WithId<import("bson").Document>>;
export declare function getBlogBySlug(request: FastifyRequest<{
    Params: SlugParams;
}>, reply: FastifyReply): Promise<import("mongodb").WithId<import("bson").Document>>;
export declare function getBlogsByBusiness(request: FastifyRequest<{
    Params: BusinessIdParams;
}>, reply: FastifyReply): Promise<import("mongodb").WithId<import("bson").Document>[]>;
export declare function createBlog(request: FastifyRequest, reply: FastifyReply): Promise<never>;
export declare function updateBlog(request: FastifyRequest<{
    Params: IdParams;
}>, reply: FastifyReply): Promise<import("mongodb").WithId<import("bson").Document>>;
export declare function deleteBlog(request: FastifyRequest<{
    Params: IdParams;
}>, reply: FastifyReply): Promise<never>;
export declare function uploadBlogFeaturedImage(request: FastifyRequest<{
    Params: IdParams;
}>, reply: FastifyReply): Promise<never>;
export {};
//# sourceMappingURL=blog.controllers.d.ts.map