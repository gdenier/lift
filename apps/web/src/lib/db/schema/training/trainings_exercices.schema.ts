import { ulid, id, table } from "../utils"
import { relations } from "drizzle-orm"
import { exercices } from "../exercices.schema"
import { trainings_series } from "./trainings_series.schema"
import { trainings_steps } from "./trainings_steps.schema"
import { trainings_supersets } from "./trainings_supersets.schema"
import { integer } from "drizzle-orm/pg-core"
import { z } from "zod"
import {
  trainingExerciceSchema,
  editTrainingExerciceSchema,
} from "../../validation/training.validator"

//---- Entity
export const trainings_exercices = table("trainings_exercices", {
  id: id(),

  order: integer("order"),

  exerciceId: ulid("exercice_id")
    .references(() => exercices.id, {
      onDelete: "set null",
    })
    .notNull(),
  supersetId: ulid("superset_id").references(() => trainings_supersets.id, {
    onDelete: "cascade",
  }),
  trainingStepId: ulid("training_step_id").references(
    () => trainings_steps.id,
    {
      onDelete: "cascade",
    }
  ),
})

//---- Relations
export const trainings_exercicesRelations = relations(
  trainings_exercices,
  ({ one, many }) => ({
    step: one(trainings_steps, {
      fields: [trainings_exercices.trainingStepId],
      references: [trainings_steps.id],
    }),
    exercice: one(exercices, {
      fields: [trainings_exercices.exerciceId],
      references: [exercices.id],
    }),
    superset: one(trainings_supersets, {
      fields: [trainings_exercices.supersetId],
      references: [trainings_supersets.id],
    }),
    series: many(trainings_series),
  })
)

//---- Types
export type TrainingExercice = z.infer<typeof trainingExerciceSchema>
export type EditTrainingExercice = z.infer<typeof editTrainingExerciceSchema>
