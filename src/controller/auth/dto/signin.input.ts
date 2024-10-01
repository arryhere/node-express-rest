import { z } from 'zod';

export const signin_input_schema = z.object({
  email: z
    .string()
    .min(1, 'Email must be at least 1 character long')
    .max(100, 'Email must be at most 100 characters long')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password must be at least 1 characters long')
    .max(100, 'Password must be at most 100 character long'),
});

export type ISignInInput = z.input<typeof signin_input_schema>;
