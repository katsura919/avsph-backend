import { z } from "zod";
import {
    applicantSchema,
    createApplicantSchema,
    updateApplicantSchema,
} from "../types/applicant.types.js";

// Infer TypeScript types from Zod schemas
export type Applicant = z.infer<typeof applicantSchema>;
export type CreateApplicantInput = z.infer<typeof createApplicantSchema>;
export type UpdateApplicantInput = z.infer<typeof updateApplicantSchema>;

// MongoDB document type (with ObjectId)
export interface ApplicantDocument {
    _id?: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    position: string;
    resumeUrl?: string;
    coverLetter?: string;
    businessId: string;
    status: 'pending' | 'reviewed' | 'shortlisted' | 'interviewed' | 'hired' | 'rejected';
    notes?: string;
    isActive: boolean;
    appliedAt: string;
    createdAt: string;
    updatedAt: string;
}
