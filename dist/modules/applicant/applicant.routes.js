import { applicantJsonSchema, createApplicantJsonSchema, updateApplicantJsonSchema, } from "../../types/applicant.types.js";
import { getAllApplicants, getApplicantById, getApplicantsByBusiness, createApplicant, updateApplicant, deleteApplicant, uploadApplicantResume, } from "./applicant.controllers.js";
const applicantRoutes = async (fastify) => {
    // GET /applicants - Get all applicants (protected, filtered by access)
    fastify.get("/applicants", {
        preHandler: [fastify.authenticate],
        schema: {
            description: "Get all applicants with optional filters (requires authentication)",
            tags: ["Applicants"],
            security: [{ bearerAuth: [] }],
            querystring: {
                type: "object",
                properties: {
                    businessId: {
                        type: "string",
                        description: "Filter by business ID",
                    },
                    status: {
                        type: "string",
                        enum: ["pending", "reviewed", "shortlisted", "interviewed", "hired", "rejected"],
                        description: "Filter by status",
                    },
                },
            },
            response: {
                200: {
                    type: "array",
                    items: applicantJsonSchema,
                },
            },
        },
    }, getAllApplicants);
    // GET /applicants/:id - Get applicant by ID (protected)
    fastify.get("/applicants/:id", {
        preHandler: [fastify.authenticate],
        schema: {
            description: "Get an applicant by ID (requires authentication)",
            tags: ["Applicants"],
            security: [{ bearerAuth: [] }],
            params: {
                type: "object",
                properties: {
                    id: { type: "string", description: "Applicant ID (MongoDB ObjectId)" },
                },
                required: ["id"],
            },
            response: {
                200: applicantJsonSchema,
                403: {
                    type: "object",
                    properties: {
                        error: { type: "string" },
                        message: { type: "string" },
                    },
                },
                404: {
                    type: "object",
                    properties: { error: { type: "string" } },
                },
            },
        },
    }, getApplicantById);
    // GET /businesses/:businessId/applicants - Get applicants by business (protected)
    fastify.get("/businesses/:businessId/applicants", {
        preHandler: [fastify.authenticate],
        schema: {
            description: "Get all applicants for a business (requires authentication)",
            tags: ["Applicants"],
            security: [{ bearerAuth: [] }],
            params: {
                type: "object",
                properties: {
                    businessId: {
                        type: "string",
                        description: "Business ID (MongoDB ObjectId)",
                    },
                },
                required: ["businessId"],
            },
            response: {
                200: {
                    type: "array",
                    items: applicantJsonSchema,
                },
                403: {
                    type: "object",
                    properties: {
                        error: { type: "string" },
                        message: { type: "string" },
                    },
                },
            },
        },
    }, getApplicantsByBusiness);
    // POST /applicants - Submit job application (PUBLIC)
    fastify.post("/applicants", {
        schema: {
            description: "Submit a job application (public endpoint)",
            tags: ["Applicants"],
            body: createApplicantJsonSchema,
            response: {
                201: applicantJsonSchema,
                400: {
                    type: "object",
                    properties: {
                        error: { type: "string" },
                        details: { type: "array" },
                    },
                },
                404: {
                    type: "object",
                    properties: { error: { type: "string" } },
                },
            },
        },
    }, createApplicant);
    // PUT /applicants/:id - Update applicant (protected)
    fastify.put("/applicants/:id", {
        preHandler: [fastify.authenticate],
        schema: {
            description: "Update an applicant (status, notes) - requires authentication",
            tags: ["Applicants"],
            security: [{ bearerAuth: [] }],
            params: {
                type: "object",
                properties: {
                    id: { type: "string", description: "Applicant ID (MongoDB ObjectId)" },
                },
                required: ["id"],
            },
            body: updateApplicantJsonSchema,
            response: {
                200: applicantJsonSchema,
                400: {
                    type: "object",
                    properties: {
                        error: { type: "string" },
                        details: { type: "array" },
                    },
                },
                403: {
                    type: "object",
                    properties: {
                        error: { type: "string" },
                        message: { type: "string" },
                    },
                },
                404: {
                    type: "object",
                    properties: { error: { type: "string" } },
                },
            },
        },
    }, updateApplicant);
    // DELETE /applicants/:id - Soft delete applicant (protected)
    fastify.delete("/applicants/:id", {
        preHandler: [fastify.authenticate],
        schema: {
            description: "Soft delete an applicant (requires authentication)",
            tags: ["Applicants"],
            security: [{ bearerAuth: [] }],
            params: {
                type: "object",
                properties: {
                    id: { type: "string", description: "Applicant ID (MongoDB ObjectId)" },
                },
                required: ["id"],
            },
            response: {
                200: {
                    type: "object",
                    properties: { message: { type: "string" } },
                },
                403: {
                    type: "object",
                    properties: {
                        error: { type: "string" },
                        message: { type: "string" },
                    },
                },
                404: {
                    type: "object",
                    properties: { error: { type: "string" } },
                },
            },
        },
    }, deleteApplicant);
    // POST /applicants/:id/resume - Upload resume (public for initial submission)
    fastify.post("/applicants/:id/resume", {
        schema: {
            description: "Upload a resume for an applicant (multipart/form-data)",
            tags: ["Applicants"],
            consumes: ["multipart/form-data"],
            params: {
                type: "object",
                properties: {
                    id: {
                        type: "string",
                        description: "Applicant ID (MongoDB ObjectId)",
                    },
                },
                required: ["id"],
            },
            response: {
                200: {
                    type: "object",
                    properties: {
                        message: { type: "string" },
                        resumeUrl: { type: "string", format: "uri" },
                        applicant: applicantJsonSchema,
                    },
                },
                400: {
                    type: "object",
                    properties: { error: { type: "string" } },
                },
                404: {
                    type: "object",
                    properties: { error: { type: "string" } },
                },
                500: {
                    type: "object",
                    properties: {
                        error: { type: "string" },
                        message: { type: "string" },
                    },
                },
            },
        },
    }, uploadApplicantResume);
};
export default applicantRoutes;
//# sourceMappingURL=applicant.routes.js.map