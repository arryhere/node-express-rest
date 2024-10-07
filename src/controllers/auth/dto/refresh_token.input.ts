import { z } from 'zod';

export const refresh_token_input_schema = z.object({
  refresh_token: z.string().max(200, 'refresh token must be at most 200 characters long'),
});

export type IRefreshTokenInput = z.input<typeof refresh_token_input_schema>;
