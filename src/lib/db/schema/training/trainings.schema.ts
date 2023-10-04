import { id, table } from "../utils"
import { z } from "zod"
import { relations } from "drizzle-orm"
import { varchar } from "drizzle-orm/pg-core"
import { trainings_steps } from "./trainings_steps.schema"
import {
  trainingSchema,
  editTrainingSchema,
} from "../../validation/training.validator"

//---- Entity
export const trainings = table("trainings", {
  id: id(),

  title: varchar("title", { length: 256 }).notNull(),

  userId: varchar("user_id", { length: 32 }).notNull(),
})

//---- Relations
export const trainingsRelations = relations(trainings, ({ many }) => ({
  steps: many(trainings_steps),
}))

//---- Types
export type Training = z.infer<typeof trainingSchema>
export type EditTraining = z.infer<typeof editTrainingSchema>
