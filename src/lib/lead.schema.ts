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

export const donateLeadSchema = z
  .object({
    name: z
      .string()
      .trim()
      .optional()
      .transform((value) => value ?? ''),
    email: z
      .string()
      .trim()
      .optional()
      .transform((value) => value ?? ''),
    phone: z
      .string()
      .trim()
      .optional()
      .transform((value) => value ?? ''),
    message: z
      .string()
      .trim()
      .optional()
      .transform((value) => value ?? ''),
  })
  .superRefine((data, context) => {
    if (!data.email && !data.phone) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter your email or phone number so we can reach you',
        path: ['email'],
      })
    }

    if (data.email && !z.string().email().safeParse(data.email).success) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Enter a valid email address',
        path: ['email'],
      })
    }
  })

export type PartnerLeadInput = z.infer<typeof partnerLeadSchema>
export type VolunteerLeadInput = z.infer<typeof volunteerLeadSchema>
export type DonateLeadInput = z.infer<typeof donateLeadSchema>
