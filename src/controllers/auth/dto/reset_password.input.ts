import { z } from 'zod';

export const reset_password_input_schema = z.object({
  forgot_password_token: z.string().max(200, 'forgot password token must be at most 200 characters long'),
  new_password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long'),
});

export type IResetPasswordInput = z.input<typeof reset_password_input_schema>;
