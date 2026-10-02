import { z } from "zod";

export const emailSchema = z.pipe(
    z.string().trim().min(1, { error: "Email is required" }),
    z.email({ error: "Enter a valid email" }),
);
export const dateSchema = z.pipe(
    z.string().min(1, { error: "Date is required" }),
    z.iso.date({ error: "Enter a valid date" }),
);
