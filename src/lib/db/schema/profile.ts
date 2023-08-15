import { datetime, int, varchar } from "drizzle-orm/mysql-core"
import { id, table } from "./utils"
import { z } from "zod"
import { InferModel, sql } from "drizzle-orm"

export const profile_weights = table("profile_weights", {
  id: id("id").primaryKey(),
  value: int("value").notNull(), // in grammes
  date: datetime("date")
    .notNull()
    .default(sql`NOW()`),
  userId: varchar("userId", { length: 32 }).notNull(),
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
