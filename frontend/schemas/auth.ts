import { z } from "zod";

const emailSchema = z.pipe(
  z.string().trim().min(1, { error: "Email is required" }),
  z.email({ error: "Enter a valid email" }),
);

export const loginSchema = z.object({
  identifier: emailSchema,
  password: z.string().min(1, { error: "Password is required" }),
});
