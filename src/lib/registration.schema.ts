import { z } from 'zod'

export const registrationInputSchema = z.object({
  childName: z.string().trim().min(1, 'Child name is required'),
  age: z
    .string()
    .trim()
    .min(1, 'Age is required')
    .refine((value) => {
      const parsed = Number(value)
      return Number.isInteger(parsed) && parsed >= 3 && parsed <= 18
    }, 'Age must be between 3 and 18'),
  parentName: z.string().trim().min(1, 'Parent name is required'),
  email: z.string().trim().email('Enter a valid email address'),
  phone: z
    .string()
    .trim()
    .min(10, 'Enter a valid phone number')
    .max(15, 'Enter a valid phone number'),
  selectedEvents: z.array(z.string()).min(1, 'Select at least one event'),
})

export type ValidatedRegistrationInput = z.infer<typeof registrationInputSchema>
