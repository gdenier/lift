import { id, integerSchema, table } from "./utils"
import { z } from "zod"
import { InferSelectModel } from "drizzle-orm"
import { integer, timestamp, varchar } from "drizzle-orm/pg-core"

export const profile_weights = table("profile_weights", {
  id: id(),
  value: integer("value").notNull(), // in grammes
  date: timestamp("date").notNull().defaultNow(),
  userId: varchar("user_id", { length: 32 }).notNull(),
})

export type ProfileWeight = InferSelectModel<typeof profile_weights>

export const createProfileWeightSchema = z.object({
  value: integerSchema(1),
  date: z.date().optional(),
})

export const insertProfileWeightSchema = z.object({
  data: z.date(),
  value: integerSchema(),
})
