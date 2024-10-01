import { isMatch } from 'date-fns';
import { z } from 'zod';

export const signup_input_schema = z.object({
  firstName: z
    .string()
    .min(1, 'First name must be at least 1 character long')
    .max(100, 'First name must be at most 100 characters long'),
  lastName: z
    .string()
    .min(1, 'Last name must be at least 1 character long')
    .max(100, 'Last name must be at most 100 characters long'),
  email: z
    .string()
    .min(1, 'Email must be at least 1 character long')
    .max(100, 'Email must be at most 100 characters long')
    .email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters long')
    .max(100, 'Password must be at most 100 characters long'),
  dob: z.string().refine((val) => {
    const test = /^\d{4}-\d{2}-\d{2}$/.test(val);
    if (!test) return false;
    const match = isMatch(val, 'yyyy-MM-dd');
    if (!match) return false;
    return true;
  }, 'Invalid date format, expected yyyy-MM-dd'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
});

export type ISignUpInput = z.input<typeof signup_input_schema>;
