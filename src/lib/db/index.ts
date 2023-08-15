import { drizzle } from "drizzle-orm/neon-http"
import { env } from "~/env.mjs"
import * as schema from "./schema"
import { neon, neonConfig } from "@neondatabase/serverless"

neonConfig.fetchConnectionCache = true

const sql = neon(env.DRIZZLE_DATABASE_URL!)

export const db = drizzle(sql, { schema, logger: true })
