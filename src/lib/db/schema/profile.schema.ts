import { foreign_id, id, table } from "./utils"
import { z } from "zod"
import { InferModel } from "drizzle-orm"
import { integer, timestamp, varchar } from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

export const profile_weights = table("profile_weights", {
  id: id(),
  value: integer("value").notNull(), // in grammes
  date: timestamp("date")
    .notNull()
    .defaultNow(),
  userId: varchar("user_id", { length: 32 }).notNull(),
})

export type ProfileWeight = InferModel<typeof profile_weights>

export const createProfileWeightSchema = z.object({
  value: z
    .number()
    .positive()
    .int()
    .min(1)
    .or(z.string())
    .pipe(z.coerce.number().positive().int().min(1)),
  date: z.date().optional(),
})

export const insertProfileWeightSchema = createInsertSchema(profile_weights).pick({
  date: true,
  value: true
})