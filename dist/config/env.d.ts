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
}, "strip", z.ZodTypeAny, {
    PORT: number;
    HOST: string;
    NODE_ENV: "development" | "production" | "test";
    CORS_ORIGIN: string;
    API_PREFIX: string;
    LOG_LEVEL: "fatal" | "error" | "warn" | "info" | "debug" | "trace";
    MONGODB_URI: string;
    JWT_SECRET: string;
}, {
    JWT_SECRET: string;
    PORT?: string | undefined;
    HOST?: string | undefined;
    NODE_ENV?: "development" | "production" | "test" | undefined;
    CORS_ORIGIN?: string | undefined;
    API_PREFIX?: string | undefined;
    LOG_LEVEL?: "fatal" | "error" | "warn" | "info" | "debug" | "trace" | undefined;
    MONGODB_URI?: string | undefined;
}>;
export type Env = z.infer<typeof envSchema>;
declare module "fastify" {
    interface FastifyInstance {
        config: Env;
    }
}
//# sourceMappingURL=env.d.ts.map