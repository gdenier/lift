import { id, ulid, integerSchema, table } from "../utils"
import { relations } from "drizzle-orm"
import { integer, real } from "drizzle-orm/pg-core"
import { trainings_exercices } from "./trainings_exercices.schema"
import { z } from "zod"
import { trainingSerieSchema } from "../../validation/training.validator"

//---- Entity
export const trainings_series = table("trainings_exercices_series", {
  id: id(),

  weight: real("weight"),
  repetition: integer("repetition"),
  time: integer("time"),
  rest: integer("rest"),
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
