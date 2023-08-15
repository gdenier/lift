import {
  double,
  float,
  int,
  primaryKey,
  serial,
  varchar,
} from "drizzle-orm/mysql-core"
import { id, table } from "./utils"
import { zfd } from "zod-form-data"
import { z } from "zod"
import { InferModel, relations } from "drizzle-orm"
import { Exercice, exercices } from "./exercices"
import { sessions } from "./sessions"

// Entity
export const trainings = table("trainings", {
  id: id("id").primaryKey(),
  title: varchar("title", { length: 256 }).notNull(),
  userId: varchar("userId", { length: 32 }).notNull(),
})

// Relations

export const trainingsRelations = relations(trainings, ({ many }) => ({
  trainings_exercices: many(trainings_exercices),
  sessions: many(sessions),
}))

export const trainings_exercices = table(
  "trainings_exercices",
  {
    id: id("id"),
    trainingId: id("trainingId"),
    exerciceId: id("exerciceId"),
    order: int("order").notNull(),
  },
  (t) => ({
    pk: primaryKey(t.id, t.exerciceId, t.trainingId),
  })
)

export interface TrainingExercice
  extends InferModel<typeof trainings_exercices> {
  exercice: Exercice
  series: InferModel<typeof trainings_series>[]
}

export const trainings_exercicesRelations = relations(
  trainings_exercices,
  ({ one, many }) => ({
    training: one(trainings, {
      fields: [trainings_exercices.trainingId],
      references: [trainings.id],
    }),
    exercice: one(exercices, {
      fields: [trainings_exercices.exerciceId],
      references: [exercices.id],
    }),
    series: many(trainings_series),
  })
)

export const trainings_series = table(
  "trainings_exercices_series",
  {
    id: id("id"),
    trainingsExercicesId: id("trainingsExercicesId").notNull(),
    weight: float("weight"),
    repetition: int("repetition"),
    time: int("time"),
    rest: int("rest").notNull(), // in seconds
    order: int("order").notNull(),
  },
  (t) => ({
    pk: primaryKey(t.id, t.trainingsExercicesId),
  })
)

export const trainings_seriesRelations = relations(
  trainings_series,
  ({ one }) => ({
    exercice: one(trainings_exercices, {
      fields: [trainings_series.trainingsExercicesId],
      references: [trainings_exercices.id],
    }),
  })
)

// Schemas

export const createTrainingSchema = zfd.formData({
  title: zfd.text(z.string()),
})

export const editTrainingSchema = z.object({
  id: z.string().ulid(),
  title: z.string(),
  trainings_exercices: z
    .array(
      z.object({
        id: z.string().ulid().optional(),
        exerciceId: z.string().ulid(),
        order: z
          .number()
          .positive()
          .int()
          .min(1)
          .or(z.string())
          .pipe(z.coerce.number().positive().int().min(1)),
        series: z
          .array(
            z
              .object({
                id: z.string().ulid().optional(),
                weight: z
                  .number()
                  .positive()
                  .or(z.string())
                  .pipe(z.coerce.number().positive())
                  .optional(),
                repetition: z
                  .number()
                  .positive()
                  .int()
                  .min(1)
                  .or(z.string())
                  .pipe(z.coerce.number().positive().int().min(1))
                  .optional(),
                time: z
                  .number()
                  .positive()
                  .int()
                  .min(1)
                  .or(z.string())
                  .pipe(z.coerce.number().positive().int().min(1))
                  .optional(),
                rest: z
                  .number()
                  .positive()
                  .int()
                  .min(1)
                  .or(z.string())
                  .pipe(z.coerce.number().positive().int().min(1)),
                order: z
                  .number()
                  .positive()
                  .int()
                  .min(1)
                  .or(z.string())
                  .pipe(z.coerce.number().positive().int().min(1)),
              })
              .refine((schema) => {
                if (schema.time && schema.repetition)
                  return { message: "time and repetition are exclusive" }
                if (schema.repetition && schema.time)
                  return { message: "time and repetition are exclusive" }
                return true
              })
          )
          .optional(),
      })
    )
    .optional(),
})
