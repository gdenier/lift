import { id, table, ulid } from "../utils"
import { relations } from "drizzle-orm"
import { integer } from "drizzle-orm/pg-core"
import { trainings_steps } from "./trainings_steps.schema"
import { trainings_exercices } from "./trainings_exercices.schema"
import { z } from "zod"
import {
  trainingSupersetSchema,
  editTrainingSupersetSchema,
} from "../../validation/training.validator"

//---- Entity
export const trainings_supersets = table("trainings_supersets", {
  id: id(),

  rest: integer("rest").notNull(),
  intervalRest: integer("interval_rest").notNull(),
  nbRound: integer("nb_round").notNull().default(1),

  trainingStepId: ulid("training_step_id")
    .references(() => trainings_steps.id, {
      onDelete: "cascade",
    })
    .notNull(),
})

//---- Relations
export const trainings_supersetsRelations = relations(
  trainings_supersets,
  ({ one, many }) => ({
    step: one(trainings_steps, {
      fields: [trainings_supersets.trainingStepId],
      references: [trainings_steps.id],
    }),
    exercices: many(trainings_exercices),
  })
)

//---- Types
export type TrainingSuperset = z.infer<typeof trainingSupersetSchema>
export type EditTrainingSuperset = z.infer<typeof editTrainingSupersetSchema>
