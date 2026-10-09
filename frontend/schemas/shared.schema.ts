import { z } from "zod";

/** Shared validation rules used by feature schemas. */
export const emailSchema = z.pipe(
    z.string().trim().min(1, { error: "Email is required" }),
    z.email({ error: "Enter a valid email" }),
);
export const dateSchema = z.pipe(
    z.string().min(1, { error: "Date is required" }),
    z.iso.date({ error: "Enter a valid date" }),
);
export const datetimeSchema = z.pipe(
    z.string().min(1, { error: "Date and time are required" }),
    z.iso.datetime({ error: "Enter a valid date and time" }),
);
