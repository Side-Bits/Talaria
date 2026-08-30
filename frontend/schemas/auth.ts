import { z } from "zod";

const emailSchema = z.pipe(
  z.string().trim().min(1, { error: "Email is required" }),
  z.email({ error: "Enter a valid email" }),
);

export const loginSchema = z.object({
  identifier: emailSchema,
  password: z.string().min(1, { error: "Password is required" }),
});

export const signUpSchema = z
  .object({
    username: z
      .string()
      .min(3, { error: "Username must be atleast 3 characters" }),
    email: emailSchema,
    password: z
      .string()
      .min(6, { error: "Password must be atleast 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { error: "Please confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords don't match",
    path: ["confirmPassword"],
  });
