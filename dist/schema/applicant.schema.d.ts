import { z } from "zod";
import { applicantSchema, createApplicantSchema, updateApplicantSchema } from "../types/applicant.types.js";
export type Applicant = z.infer<typeof applicantSchema>;
export type CreateApplicantInput = z.infer<typeof createApplicantSchema>;
export type UpdateApplicantInput = z.infer<typeof updateApplicantSchema>;
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
//# sourceMappingURL=applicant.schema.d.ts.map