import { z } from 'zod';

// Applicant status enum
export const applicantStatusEnum = z.enum([
    'pending',
    'reviewed',
    'shortlisted',
    'interviewed',
    'hired',
    'rejected'
]);

// Applicant schema
export const applicantSchema = z.object({
    _id: z.string().optional(),
    firstName: z.string().min(1, 'First name is required').max(50),
    lastName: z.string().min(1, 'Last name is required').max(50),
    email: z.string().email('Invalid email address'),
    phone: z.string().max(20).optional(),
    position: z.string().min(1, 'Position is required').max(100),
    resumeUrl: z.string().url().optional(),
    coverLetter: z.string().max(2000).optional(),
    businessId: z.string().min(1, 'Business ID is required'),
    status: applicantStatusEnum.default('pending'),
    notes: z.string().max(1000).optional(),
    isActive: z.boolean().default(true),
    appliedAt: z.string().datetime().optional(),
    createdAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime().optional(),
});

// Schema for creating a new applicant (public submission)
export const createApplicantSchema = applicantSchema.omit({
    _id: true,
    status: true,
    notes: true,
    isActive: true,
    appliedAt: true,
});

// Schema for updating an applicant (admin only - status/notes)
export const updateApplicantSchema = z.object({
    status: applicantStatusEnum.optional(),
    notes: z.string().max(1000).optional(),
    isActive: z.boolean().optional(),
});

// JSON Schemas for Fastify route validation
export const applicantJsonSchema = {
    type: 'object',
    properties: {
        _id: { type: 'string' },
        firstName: { type: 'string', minLength: 1, maxLength: 50 },
        lastName: { type: 'string', minLength: 1, maxLength: 50 },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string', maxLength: 20 },
        position: { type: 'string', minLength: 1, maxLength: 100 },
        resumeUrl: { type: 'string', format: 'uri' },
        coverLetter: { type: 'string', maxLength: 2000 },
        businessId: { type: 'string' },
        status: { type: 'string', enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'hired', 'rejected'] },
        notes: { type: 'string', maxLength: 1000 },
        isActive: { type: 'boolean' },
        appliedAt: { type: 'string', format: 'date-time' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
    },
    required: ['firstName', 'lastName', 'email', 'position', 'businessId'],
} as const;

export const createApplicantJsonSchema = {
    type: 'object',
    properties: {
        firstName: { type: 'string', minLength: 1, maxLength: 50 },
        lastName: { type: 'string', minLength: 1, maxLength: 50 },
        email: { type: 'string', format: 'email' },
        phone: { type: 'string', maxLength: 20 },
        position: { type: 'string', minLength: 1, maxLength: 100 },
        resumeUrl: { type: 'string', format: 'uri' },
        coverLetter: { type: 'string', maxLength: 2000 },
        businessId: { type: 'string' },
    },
    required: ['firstName', 'lastName', 'email', 'position', 'businessId'],
} as const;

export const updateApplicantJsonSchema = {
    type: 'object',
    properties: {
        status: { type: 'string', enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'hired', 'rejected'] },
        notes: { type: 'string', maxLength: 1000 },
        isActive: { type: 'boolean' },
    },
} as const;
