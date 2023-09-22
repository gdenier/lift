import { ulid, id, integerSchema, table } from "../utils"
import { relations } from "drizzle-orm"
import { exerciceSchema, exercices } from "../exercices.schema"
import {
  trainingSerieSchema,
  trainings_series,
} from "./trainings_series.schema"
import { trainings_steps } from "./trainings_steps.schema"
import { trainings_supersets } from "./trainings_supersets.schema"
import { integer } from "drizzle-orm/pg-core"
import { z } from "zod"

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

//---- Schemas
export var trainingExerciceSchema = z.object({
  id: z.string().ulid(),
  order: integerSchema(0).optional(),
  exerciceId: z.string().ulid().optional(),
  supersetId: z.string().ulid().optional(),
  trainingStepId: z.string().ulid().optional(),
  exercice: exerciceSchema,
  series: z.array(trainingSerieSchema).optional(),
})

export var editTrainingExerciceSchema = trainingExerciceSchema
  .omit({ exercice: true, series: true })
  .partial({ id: true })
  .extend({
    series: z.array(trainingSerieSchema).optional(),
  })
