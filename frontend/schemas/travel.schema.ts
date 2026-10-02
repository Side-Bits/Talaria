import { z } from "zod";
import { dateSchema } from "./shared.schema";

export const travelSchema = z
    .object({
        id: z.number(),
        name: z.string().trim().min(1, { error: "Travel name is required" }),
        start_date: dateSchema,
        end_date: dateSchema,
        description: z.string().trim().optional(),
    })
    .refine((travel) => travel.end_date >= travel.start_date, {
        error: "End date cannot be before start date",
        path: ["end_date"],
    });
