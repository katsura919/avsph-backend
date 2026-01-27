import { z } from "zod";
export declare const envSchema: z.ZodObject<{
    PORT: z.ZodEffects<z.ZodDefault<z.ZodString>, number, string | undefined>;
    HOST: z.ZodDefault<z.ZodString>;
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "production", "test"]>>;
    CORS_ORIGIN: z.ZodDefault<z.ZodString>;
    API_PREFIX: z.ZodDefault<z.ZodString>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<["fatal", "error", "warn", "info", "debug", "trace"]>>;
    MONGODB_URI: z.ZodDefault<z.ZodString>;
    JWT_SECRET: z.ZodString;
    CLOUDINARY_CLOUD_NAME: z.ZodString;
    CLOUDINARY_API_KEY: z.ZodString;
    CLOUDINARY_API_SECRET: z.ZodString;
    SMTP_HOST: z.ZodDefault<z.ZodString>;
    SMTP_PORT: z.ZodEffects<z.ZodDefault<z.ZodString>, number, string | undefined>;
    SMTP_SECURE: z.ZodEffects<z.ZodDefault<z.ZodString>, boolean, string | undefined>;
    SMTP_USER: z.ZodString;
    SMTP_PASS: z.ZodString;
    SMTP_FROM: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    PORT: number;
    HOST: string;
    NODE_ENV: "development" | "production" | "test";
    CORS_ORIGIN: string;
    API_PREFIX: string;
    LOG_LEVEL: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
    MONGODB_URI: string;
    JWT_SECRET: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_SECURE: boolean;
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_FROM?: string | undefined;
}, {
    JWT_SECRET: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    SMTP_USER: string;
    SMTP_PASS: string;
    PORT?: string | undefined;
    HOST?: string | undefined;
    NODE_ENV?: "development" | "production" | "test" | undefined;
    CORS_ORIGIN?: string | undefined;
    API_PREFIX?: string | undefined;
    LOG_LEVEL?: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | undefined;
    MONGODB_URI?: string | undefined;
    SMTP_HOST?: string | undefined;
    SMTP_PORT?: string | undefined;
    SMTP_SECURE?: string | undefined;
    SMTP_FROM?: string | undefined;
}>;
export type Env = z.infer<typeof envSchema>;
declare module "fastify" {
    interface FastifyInstance {
        config: Env;
    }
}
//# sourceMappingURL=env.d.ts.map