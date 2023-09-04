import { foreign_id, id, integerSchema, table } from "./utils"
import { z } from "zod"
import { InferSelectModel, relations } from "drizzle-orm"
import { Exercice, exercices } from "./exercices.schema"
import { sessions } from "./sessions.schema"
import { integer, real, unique, varchar } from "drizzle-orm/pg-core"

//---- TRAINING
export const trainings = table("trainings", {
  id: id(),
  title: varchar("title", { length: 256 }).notNull(),
  userId: varchar("user_id", { length: 32 }).notNull(),
})

export const trainingsRelations = relations(trainings, ({ many }) => ({
  trainings_exercices: many(trainings_exercices),
  trainings_supersets: many(trainings_supersets),
  sessions: many(sessions),
}))

//---- TRAINING EXERCICE
export const trainings_exercices = table("trainings_exercices", {
  id: id(),
  trainingId: foreign_id("training_id").notNull(),
  exerciceId: foreign_id("exercice_id").notNull(),
  order: integer("order").notNull(),
})

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

//---- TRAINING SERIE
export const trainings_series = table("trainings_exercices_series", {
  id: id(),
  trainingsExercicesId: foreign_id("trainings_exercices_id").notNull(),
  weight: real("weight"),
  repetition: integer("repetition"),
  time: integer("time"),
  rest: integer("rest").notNull(), // in seconds
  order: integer("order").notNull(),
})

export const trainings_seriesRelations = relations(
  trainings_series,
  ({ one }) => ({
    exercice: one(trainings_exercices, {
      fields: [trainings_series.trainingsExercicesId],
      references: [trainings_exercices.id],
    }),
  })
)

//---- TRAINING SUPER SET
export const trainings_supersets = table("trainings_supersets", {
  id: id(),
  trainingId: foreign_id("training_id").notNull(),
  order: integer("order").notNull(),
})

export const trainings_supersetsRelations = relations(
  trainings_supersets,
  ({ one, many }) => ({
    training: one(trainings, {
      fields: [trainings_supersets.trainingId],
      references: [trainings.id],
    }),
    exercices: many(trainings_supersets_exercices),
    rounds: many(trainings_supersets_rounds),
  })
)

//---- TRAINING SUPER SET EXERCICES
export const trainings_supersets_exercices = table(
  "trainings_supersets_exercices",
  {
    id: id(),
    trainingSupersetId: foreign_id("trainings_supersets_id").notNull(),
    exerciceId: foreign_id("exercice_id").notNull(),
    order: integer("order").notNull(),
  }
)

export const trainings_supersets_exercicesRelations = relations(
  trainings_supersets_exercices,
  ({ one }) => ({
    superset: one(trainings_supersets, {
      fields: [trainings_supersets_exercices.trainingSupersetId],
      references: [trainings_supersets.id],
    }),
    exercice: one(exercices, {
      fields: [trainings_supersets_exercices.exerciceId],
      references: [exercices.id],
    }),
  })
)

//---- TRAINING SUPER SET ROUNDS
export const trainings_supersets_rounds = table("trainings_supersets_rounds", {
  id: id(),
  trainingSupersetId: foreign_id("trainings_supersets_id").notNull(),
  order: integer("order").notNull(),
  rest: integer("rest").notNull(), // in seconds
  intervalRest: integer("interval_rest").notNull(),
})

export const trainings_supersets_roundsRelations = relations(
  trainings_supersets_rounds,
  ({ one, many }) => ({
    superset: one(trainings_supersets, {
      fields: [trainings_supersets_rounds.trainingSupersetId],
      references: [trainings_supersets.id],
    }),
    series: many(trainings_supersets_series),
  })
)

//---- TRAINING SUPER SET SERIE
export const trainings_supersets_series = table("trainings_supersets_series", {
  id: id(),
  trainingsSupersetsRoundsId: foreign_id(
    "trainings_supersets_rounds_id"
  ).notNull(),
  weight: real("weight"),
  repetition: integer("repetition"),
  time: integer("time"),
  order: integer("order").notNull(),
})

export const trainings_supersets_seriesRelations = relations(
  trainings_supersets_series,
  ({ one }) => ({
    round: one(trainings_supersets_rounds, {
      fields: [trainings_supersets_series.trainingsSupersetsRoundsId],
      references: [trainings_supersets_rounds.id],
    }),
  })
)

// TYPE
export type Serie =
  | InferSelectModel<typeof trainings_series>
  | InferSelectModel<typeof trainings_supersets_series>
export interface TrainingExercice
  extends InferSelectModel<typeof trainings_exercices> {
  exercice: Exercice
  series: InferSelectModel<typeof trainings_series>[]
}
export interface TrainingSuperset
  extends InferSelectModel<typeof trainings_supersets> {
  exercices: (InferSelectModel<typeof trainings_supersets_exercices> & {
    exercice: InferSelectModel<typeof exercices>
  })[]
  rounds: (InferSelectModel<typeof trainings_supersets_rounds> & {
    series: InferSelectModel<typeof trainings_supersets_series>[]
  })[]
}

// Schemas
export const createTrainingSchema = z.object({
  title: z.string(),
})

export type EditTrainingSchema = z.infer<typeof editTrainingSchema>
export const editTrainingSchema = z.object({
  id: z.string().ulid(),
  title: z.string(),
  trainings_exercices: z
    .array(
      z.object({
        id: z.string().ulid().optional(),
        exerciceId: z.string().ulid(),
        order: integerSchema(0),
        series: z
          .array(
            z.object({
              id: z.string().ulid().optional(),
              weight: integerSchema().optional(),
              repetition: integerSchema(0).optional(),
              time: integerSchema(0).optional(),
              rest: integerSchema(0),
              order: integerSchema(0),
            })
          )
          .optional(),
      })
    )
    .optional(),
  trainings_superset: z
    .array(
      z.object({
        id: z.string().ulid().optional(),
        order: integerSchema(0),
        exercices: z.array(
          z.object({
            id: z.string().ulid().optional(),
            exerciceId: z.string().ulid(),
            order: integerSchema(0),
          })
        ),
        rounds: z.array(
          z.object({
            id: z.string().ulid().optional(),
            order: integerSchema(0),
            rest: integerSchema(0),
            intervalRest: integerSchema(0),
            series: z.array(
              z.object({
                id: z.string().ulid().optional(),
                weight: integerSchema().optional(),
                repetition: integerSchema(0).optional(),
                time: integerSchema(0).optional(),
                order: integerSchema(0),
              })
            ),
          })
        ),
      })
    )
    .optional(),
})