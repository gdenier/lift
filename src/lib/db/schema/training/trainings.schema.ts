import { id, table } from "../utils"
import { z } from "zod"
import { relations } from "drizzle-orm"
import { varchar } from "drizzle-orm/pg-core"
import {
  editTrainingStepSchema,
  trainingStepSchema,
  trainings_steps,
} from "./trainings_steps.schema"

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

//---- Schemas
export var trainingSchema = z.object({
  id: z.string().ulid(),
  title: z.string(),
  userId: z.string(),
  steps: z.array(trainingStepSchema).optional(),
})

export var createTrainingSchema = trainingSchema.omit({
  id: true,
  steps: true,
  userId: true,
})

export var editTrainingSchema = trainingSchema
  .omit({
    userId: true,
    steps: true,
  })
  .extend({
    steps: z.array(editTrainingStepSchema).optional(),
  })
