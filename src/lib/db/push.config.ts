import type { Config } from "drizzle-kit"
import * as dotenv from "dotenv"
dotenv.config({
  path: ".env.local",
})

export default {
  schema: "./src/lib/db/schema/*",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DRIZZLE_DATABASE_URL as string,
  },
  tablesFilter: ["lift_*"],
} satisfies Config
