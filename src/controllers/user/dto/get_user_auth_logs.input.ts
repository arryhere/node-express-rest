import { isMatch } from 'date-fns';
import { z } from 'zod';

export const get_user_auth_logs_input_schema = z.object({
  user_id: z.string(),

  start_date: z.string().refine((val) => {
    const test = /^\d{4}-\d{2}-\d{2}$/.test(val);
    if (!test) return false;
    const match = isMatch(val, 'yyyy-MM-dd');
    if (!match) return false;
    return true;
  }, 'Invalid date format, expected yyyy-MM-dd'),

  end_date: z.string().refine((val) => {
    const test = /^\d{4}-\d{2}-\d{2}$/.test(val);
    if (!test) return false;
    const match = isMatch(val, 'yyyy-MM-dd');
    if (!match) return false;
    return true;
  }, 'Invalid date format, expected yyyy-MM-dd'),

  start_time: z.string().refine((val) => {
    const test = /^\d{2}:\d{2}:\d{2}$/.test(val);
    if (!test) return false;
    const match = isMatch(val, 'HH:mm:ss');
    if (!match) return false;
    return true;
  }, 'Invalid time format, expected HH:mm:ss'),

  end_time: z.string().refine((val) => {
    const test = /^\d{2}:\d{2}:\d{2}$/.test(val);
    if (!test) return false;
    const match = isMatch(val, 'HH:mm:ss');
    if (!match) return false;
    return true;
  }, 'Invalid time format, expected HH:mm:ss'),

  sort_by: z.enum(['asc', 'desc']),
  limit: z.number().positive(), // > 0
  page: z.number().nonnegative(), //  >= 0
});

export type IGetUserAuthLogsInput = z.input<typeof get_user_auth_logs_input_schema>;
