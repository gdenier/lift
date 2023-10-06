import { drizzle } from "drizzle-orm/neon-http"
import { env } from "~/env.mjs"
import { neon, neonConfig } from "@neondatabase/serverless"

import * as exercice from "./schema/exercices.schema"
import * as trainings from "./schema/training/trainings.schema"
import * as trainings_exercices from "./schema/training/trainings_exercices.schema"
import * as trainings_series from "./schema/training/trainings_series.schema"
import * as trainings_steps from "./schema/training/trainings_steps.schema"
import * as trainings_supersets from "./schema/training/trainings_supersets.schema"
import * as profile from "./schema/profile.schema"

neonConfig.fetchConnectionCache = true

const sql = neon(env.DRIZZLE_DATABASE_URL!)

export const db = drizzle(sql, {
  schema: {
    ...exercice,
    ...trainings,
    ...trainings_exercices,
    ...trainings_series,
    ...trainings_steps,
    ...trainings_supersets,
    ...profile,
  },
  logger: env.DRIZZLE_LOGGING,
})
