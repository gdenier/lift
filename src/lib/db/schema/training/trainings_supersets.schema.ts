import { id, integerSchema, table, ulid } from "../utils"
import { relations } from "drizzle-orm"
import { integer } from "drizzle-orm/pg-core"
import { trainings_steps } from "./trainings_steps.schema"
import {
  editTrainingExerciceSchema,
  trainingExerciceSchema,
  trainings_exercices,
} from "./trainings_exercices.schema"
import { z } from "zod"

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

//---- Schemas
export var trainingSupersetSchema = z.object({
  id: z.string().ulid(),
  rest: integerSchema(0),
  intervalRest: integerSchema(0),
  nbRound: integerSchema(),
  trainingStepId: z.string().ulid(),
  exercices: z.array(trainingExerciceSchema).optional().nullable(),
})

export var editTrainingSupersetSchema = trainingSupersetSchema
  .omit({ exercices: true })
  .partial({ id: true, trainingStepId: true })
  .extend({
    exercices: z.array(editTrainingExerciceSchema).optional(),
  })
