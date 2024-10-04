import { z } from 'zod';

export const verify_input_schema = z.object({
  token: z.string().max(200, 'token must be at most 200 characters long'),
});

export type IVerifyInput = z.input<typeof verify_input_schema>;
