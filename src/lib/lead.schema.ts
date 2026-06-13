import { z } from 'zod'

const baseLeadSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .optional()
    .transform((value) => value ?? ''),
  message: z.string().trim().min(1, 'Message is required'),
})

export const partnerLeadSchema = baseLeadSchema.extend({
  organization: z.string().trim().min(1, 'Organization is required'),
})

export const volunteerLeadSchema = baseLeadSchema

export type PartnerLeadInput = z.infer<typeof partnerLeadSchema>
export type VolunteerLeadInput = z.infer<typeof volunteerLeadSchema>
