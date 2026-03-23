import { z } from 'zod';

/**
 * AUTHENTICATION SCHEMAS
 * Administrative login validation rules.
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Email or username is required" })
    .email({ message: "Must be a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});