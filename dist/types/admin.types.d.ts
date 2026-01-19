import { z } from 'zod';
export declare const adminSchema: z.ZodObject<{
    _id: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isActive: boolean;
    _id?: string | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    _id?: string | undefined;
    isActive?: boolean | undefined;
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}>;
export declare const createAdminSchema: z.ZodObject<Omit<{
    _id: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    password: z.ZodString;
    firstName: z.ZodString;
    lastName: z.ZodString;
    isActive: z.ZodDefault<z.ZodBoolean>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "_id" | "createdAt" | "updatedAt">, "strip", z.ZodTypeAny, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isActive: boolean;
}, {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isActive?: boolean | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type Admin = z.infer<typeof adminSchema>;
export type CreateAdmin = z.infer<typeof createAdminSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export declare const adminJsonSchema: {
    readonly type: "object";
    readonly properties: {
        readonly _id: {
            readonly type: "string";
        };
        readonly email: {
            readonly type: "string";
            readonly format: "email";
        };
        readonly firstName: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 50;
        };
        readonly lastName: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 50;
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
    readonly required: readonly ["email", "firstName", "lastName"];
};
export declare const createAdminJsonSchema: {
    readonly type: "object";
    readonly properties: {
        readonly email: {
            readonly type: "string";
            readonly format: "email";
        };
        readonly password: {
            readonly type: "string";
            readonly minLength: 8;
        };
        readonly firstName: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 50;
        };
        readonly lastName: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 50;
        };
    };
    readonly required: readonly ["email", "password", "firstName", "lastName"];
};
export declare const loginJsonSchema: {
    readonly type: "object";
    readonly properties: {
        readonly email: {
            readonly type: "string";
            readonly format: "email";
        };
        readonly password: {
            readonly type: "string";
            readonly minLength: 1;
        };
    };
    readonly required: readonly ["email", "password"];
};
export declare const loginResponseJsonSchema: {
    readonly type: "object";
    readonly properties: {
        readonly token: {
            readonly type: "string";
        };
        readonly admin: {
            readonly type: "object";
            readonly properties: {
                readonly _id: {
                    readonly type: "string";
                };
                readonly email: {
                    readonly type: "string";
                    readonly format: "email";
                };
                readonly firstName: {
                    readonly type: "string";
                    readonly minLength: 1;
                    readonly maxLength: 50;
                };
                readonly lastName: {
                    readonly type: "string";
                    readonly minLength: 1;
                    readonly maxLength: 50;
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
            readonly required: readonly ["email", "firstName", "lastName"];
        };
    };
    readonly required: readonly ["token", "admin"];
};
//# sourceMappingURL=admin.types.d.ts.map