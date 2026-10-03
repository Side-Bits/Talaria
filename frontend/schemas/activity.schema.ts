import { z } from "zod";
import { dateSchema } from "./shared.schema";
import type { Activity } from "@/types/activity";

export const activitySchema = z
    .object({
        id: z.number(),
        id_travel: z.number(),
        name: z.string().trim().min(1, { error: "Activity name is required" }),
        description: z.string(),
        location: z.string().trim().min(1, { error: "Location is required" }),
        start_date: dateSchema,
        end_date: dateSchema,
        price: z.number(),
    })
    .refine((activity) => activity.end_date >= activity.start_date, {
        error: "End date cannot be before start date",
        path: ["end_date"],
    }) satisfies z.ZodType<Activity>;
