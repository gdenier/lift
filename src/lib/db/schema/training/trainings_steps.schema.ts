import { relations } from "drizzle-orm"
import { id, integerSchema, table, ulid } from "../utils"
import { integer } from "drizzle-orm/pg-core"
import { trainings } from "./trainings.schema"
import {
  editTrainingExerciceSchema,
  trainingExerciceSchema,
  trainings_exercices,
} from "./trainings_exercices.schema"
import {
  editTrainingSupersetSchema,
  trainingSupersetSchema,
  trainings_supersets,
} from "./trainings_supersets.schema"
import { z } from "zod"

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

//---- Schemas
export var trainingStepSchema = z.object({
  id: z.string().ulid(),
  order: integerSchema(0),
  trainingId: z.string().ulid(),
  exercice: trainingExerciceSchema.optional().nullable(),
  superset: trainingSupersetSchema.optional().nullable(),
})

export var editTrainingStepSchema = trainingStepSchema
  .omit({ exercice: true, superset: true })
  .partial({ id: true, trainingId: true })
  .extend({
    exercice: editTrainingExerciceSchema.optional(),
    superset: editTrainingSupersetSchema.optional(),
  })
