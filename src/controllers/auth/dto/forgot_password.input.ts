import { z } from 'zod';

export const forgot_password_input_schema = z.object({
  email: z
    .string()
    .min(1, 'Email must be at least 1 character long')
    .max(100, 'Email must be at most 100 characters long')
    .email('Invalid email address'),
});

export type IForgotPasswordInput = z.input<typeof forgot_password_input_schema>;
