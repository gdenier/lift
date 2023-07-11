import {
  datetime,
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
import { InferModel, relations, sql } from "drizzle-orm"
import { Exercice, exercices } from "./exercices"
import { trainings } from "./trainings"

export const sessions = table("sessions", {
  id: id("id").primaryKey(),
  trainingId: id("trainingId").notNull(),
  userId: varchar("userId", { length: 32 }).notNull(),
  createdAt: datetime("createdAt")
    .notNull()
    .default(sql`NOW()`),
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
    id: id("id"),
    sessionId: id("sessionId"),
    exerciceId: id("exerciceId"),
    order: int("order").notNull(),
  },
  (t) => ({
    pk: primaryKey(t.id, t.exerciceId, t.sessionId),
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
    id: id("id"),
    sessionsExercicesId: id("sessionsExercicesId").notNull(),
    weight: float("weight"),
    repetition: int("repetition").notNull(),
    rest: int("rest").notNull(), // in seconds
    order: int("order").notNull(),
  },
  (t) => ({
    pk: primaryKey(t.id, t.sessionsExercicesId),
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
