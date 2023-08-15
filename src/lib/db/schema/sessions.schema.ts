import { foreign_id, id, table } from "./utils"
import { z } from "zod"
import { InferModel, relations, sql } from "drizzle-orm"
import { Exercice, exercices } from "./exercices.schema"
import { trainings } from "./trainings.schema"
import { integer, primaryKey, real, timestamp, unique, varchar } from "drizzle-orm/pg-core"

export const sessions = table("sessions", {
  id: id(),
  trainingId: foreign_id("training_id").notNull(),
  userId: varchar("user_id", { length: 32 }).notNull(),
  createdAt: timestamp("date")
    .notNull()
    .defaultNow(),
})

export const sessionsRelations = relations(sessions, ({ one, many }) => ({
  training: one(trainings, {
    fields: [sessions.trainingId],
    references: [trainings.id],
  }),
  sessions_exercices: many(sessions_exercices),
}))

export const sessions_exercices = table(
  "sessions_exercices",
  {
    id: id(),
    sessionId: foreign_id("session_id").notNull(),
    exerciceId: foreign_id("exercice_id").notNull(),
    order: integer("order").notNull(),
  },
  (t) => ({
    unq: unique().on(t.id, t.exerciceId, t.sessionId),
  })
)

export const sessions_exercicesRelations = relations(
  sessions_exercices,
  ({ one, many }) => ({
    session: one(sessions, {
      fields: [sessions_exercices.sessionId],
      references: [sessions.id],
    }),
    exercice: one(exercices, {
      fields: [sessions_exercices.exerciceId],
      references: [exercices.id],
    }),
    series: many(sessions_series),
  })
)

export const sessions_series = table(
  "sessions_exercices_series",
  {
    id: id(),
    sessionsExercicesId: foreign_id("sessions_exercices_id").notNull(),
    weight: real("weight"),
    repetition: integer("repetition").notNull(),
    rest: integer("rest").notNull(), // in seconds
    order: integer("order").notNull(),
  },
  (t) => ({
    unq: unique().on(t.id, t.sessionsExercicesId),
  })
)

export const sessions_seriesRelations = relations(
  sessions_series,
  ({ one }) => ({
    exercice: one(sessions_exercices, {
      fields: [sessions_series.sessionsExercicesId],
      references: [sessions_exercices.id],
    }),
  })
)

export interface SessionExercice extends InferModel<typeof sessions_exercices> {
  exercice: Exercice
  series: InferModel<typeof sessions_series>[]
}
