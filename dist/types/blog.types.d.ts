import { z } from 'zod';
export declare const blogStatusEnum: z.ZodEnum<["draft", "published"]>;
export declare const blogSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    slug: z.ZodString;
    content: z.ZodString;
    excerpt: z.ZodOptional<z.ZodString>;
    featuredImage: z.ZodOptional<z.ZodString>;
    businessId: z.ZodString;
    authorId: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["draft", "published"]>>;
    publishedAt: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "draft" | "published";
    content: string;
    title: string;
    isActive: boolean;
    slug: string;
    businessId: string;
    authorId: string;
    _id?: string | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    excerpt?: string | undefined;
    featuredImage?: string | undefined;
    publishedAt?: string | undefined;
}, {
    content: string;
    title: string;
    slug: string;
    businessId: string;
    authorId: string;
    status?: "draft" | "published" | undefined;
    _id?: string | undefined;
    isActive?: boolean | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
    excerpt?: string | undefined;
    featuredImage?: string | undefined;
    publishedAt?: string | undefined;
}>;
export declare const createBlogSchema: z.ZodObject<Omit<{
    _id: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    slug: z.ZodString;
    content: z.ZodString;
    excerpt: z.ZodOptional<z.ZodString>;
    featuredImage: z.ZodOptional<z.ZodString>;
    businessId: z.ZodString;
    authorId: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<["draft", "published"]>>;
    publishedAt: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "_id" | "createdAt" | "updatedAt" | "authorId" | "publishedAt">, "strip", z.ZodTypeAny, {
    status: "draft" | "published";
    content: string;
    title: string;
    isActive: boolean;
    slug: string;
    businessId: string;
    excerpt?: string | undefined;
    featuredImage?: string | undefined;
}, {
    content: string;
    title: string;
    slug: string;
    businessId: string;
    status?: "draft" | "published" | undefined;
    isActive?: boolean | undefined;
    excerpt?: string | undefined;
    featuredImage?: string | undefined;
}>;
export declare const updateBlogSchema: z.ZodObject<Omit<{
    status: z.ZodOptional<z.ZodDefault<z.ZodEnum<["draft", "published"]>>>;
    content: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    slug: z.ZodOptional<z.ZodString>;
    excerpt: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    featuredImage: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    businessId: z.ZodOptional<z.ZodString>;
}, "businessId">, "strip", z.ZodTypeAny, {
    status?: "draft" | "published" | undefined;
    content?: string | undefined;
    title?: string | undefined;
    isActive?: boolean | undefined;
    slug?: string | undefined;
    excerpt?: string | undefined;
    featuredImage?: string | undefined;
}, {
    status?: "draft" | "published" | undefined;
    content?: string | undefined;
    title?: string | undefined;
    isActive?: boolean | undefined;
    slug?: string | undefined;
    excerpt?: string | undefined;
    featuredImage?: string | undefined;
}>;
export declare const blogJsonSchema: {
    readonly type: "object";
    readonly properties: {
        readonly _id: {
            readonly type: "string";
        };
        readonly title: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 200;
        };
        readonly slug: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 200;
        };
        readonly content: {
            readonly type: "string";
            readonly minLength: 1;
        };
        readonly excerpt: {
            readonly type: "string";
            readonly maxLength: 500;
        };
        readonly featuredImage: {
            readonly type: "string";
            readonly format: "uri";
        };
        readonly businessId: {
            readonly type: "string";
        };
        readonly authorId: {
            readonly type: "string";
        };
        readonly status: {
            readonly type: "string";
            readonly enum: readonly ["draft", "published"];
        };
        readonly publishedAt: {
            readonly type: "string";
            readonly format: "date-time";
        };
        readonly isActive: {
            readonly type: "boolean";
        };
        readonly createdAt: {
            readonly type: "string";
            readonly format: "date-time";
        };
        readonly updatedAt: {
            readonly type: "string";
            readonly format: "date-time";
        };
    };
    readonly required: readonly ["title", "slug", "content", "businessId"];
};
export declare const createBlogJsonSchema: {
    readonly type: "object";
    readonly properties: {
        readonly title: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 200;
        };
        readonly slug: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 200;
            readonly pattern: "^[a-z0-9-]+$";
        };
        readonly content: {
            readonly type: "string";
            readonly minLength: 1;
        };
        readonly excerpt: {
            readonly type: "string";
            readonly maxLength: 500;
        };
        readonly featuredImage: {
            readonly type: "string";
            readonly format: "uri";
        };
        readonly businessId: {
            readonly type: "string";
        };
        readonly status: {
            readonly type: "string";
            readonly enum: readonly ["draft", "published"];
            readonly default: "draft";
        };
        readonly isActive: {
            readonly type: "boolean";
            readonly default: true;
        };
    };
    readonly required: readonly ["title", "slug", "content", "businessId"];
};
export declare const updateBlogJsonSchema: {
    readonly type: "object";
    readonly properties: {
        readonly title: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 200;
        };
        readonly slug: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 200;
            readonly pattern: "^[a-z0-9-]+$";
        };
        readonly content: {
            readonly type: "string";
            readonly minLength: 1;
        };
        readonly excerpt: {
            readonly type: "string";
            readonly maxLength: 500;
        };
        readonly featuredImage: {
            readonly type: "string";
            readonly format: "uri";
        };
        readonly status: {
            readonly type: "string";
            readonly enum: readonly ["draft", "published"];
        };
        readonly isActive: {
            readonly type: "boolean";
        };
    };
};
//# sourceMappingURL=blog.types.d.ts.map