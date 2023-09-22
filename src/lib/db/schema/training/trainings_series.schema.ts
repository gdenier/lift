import { id, ulid, integerSchema, table } from "../utils"
import { relations } from "drizzle-orm"
import { integer, real } from "drizzle-orm/pg-core"
import { trainings_exercices } from "./trainings_exercices.schema"
import { z } from "zod"

//---- Entity
export const trainings_series = table("trainings_exercices_series", {
  id: id(),

  weight: real("weight"),
  repetition: integer("repetition"),
  time: integer("time"),
  rest: integer("rest").notNull(),
  order: integer("order").notNull(),
  trainingExerciceId: ulid("training_exercice_id")
    .references(() => trainings_exercices.id, { onDelete: "cascade" })
    .notNull(),
})

//---- Relations
export const trainings_seriesRelations = relations(
  trainings_series,
  ({ one }) => ({
    exercice: one(trainings_exercices, {
      fields: [trainings_series.trainingExerciceId],
      references: [trainings_exercices.id],
    }),
  })
)

//---- Types
export type TrainingSerie = z.infer<typeof trainingSerieSchema>

//---- Schemas
export var trainingSerieSchema = z.object({
  id: z.string().ulid(),
  weight: integerSchema(0).optional(),
  repetition: integerSchema(0).optional(),
  time: integerSchema(0).optional(),
  rest: integerSchema(0),
  order: integerSchema(0),
  trainingExerciceId: z.string().ulid(),
})

export var editTrainingSerieSchema = trainingSerieSchema.partial({
  id: true,
  trainingExerciceId: true,
})
