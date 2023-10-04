import { relations } from "drizzle-orm"
import { id, table, ulid } from "../utils"
import { integer } from "drizzle-orm/pg-core"
import { trainings } from "./trainings.schema"
import { trainings_exercices } from "./trainings_exercices.schema"
import { trainings_supersets } from "./trainings_supersets.schema"
import { z } from "zod"
import {
  trainingStepSchema,
  editTrainingStepSchema,
} from "../../validation/training.validator"

//---- Entity
export const trainings_steps = table("trainings_steps", {
  id: id(),

  order: integer("order").notNull(),

  trainingId: ulid("training_id")
    .references(() => trainings.id, {
      onDelete: "cascade",
    })
    .notNull(),
})

//---- Relations
export const trainings_stepsRelations = relations(
  trainings_steps,
  ({ one }) => ({
    training: one(trainings, {
      fields: [trainings_steps.trainingId],
      references: [trainings.id],
    }),
    exercice: one(trainings_exercices),
    superset: one(trainings_supersets),
  })
)

//---- Types
export type TrainingStep = z.infer<typeof trainingStepSchema>
export type EditTrainingStep = z.infer<typeof editTrainingStepSchema>
