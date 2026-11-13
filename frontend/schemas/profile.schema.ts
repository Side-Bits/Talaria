import { z } from "zod";
import { dateSchema, emailSchema } from "./shared.schema";

export const profileSchema = z
    .object({
        username: z
            .string()
            .min(3, { error: "Username must be atleast 3 characters" }),
        email: emailSchema,
        birthdate: dateSchema,
        name: z.string().trim().min(1, { error: "Name is required" }),
        surname1: z.string(),
        surname2: z.string(),
        language: z.string(),
        currency: z.string(),
    })
