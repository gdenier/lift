import type { Config } from "drizzle-kit"
import * as dotenv from "dotenv"
dotenv.config({
  path: ".env.local",
})

export default {
  schema: "./src/lib/db/schema/*",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    connectionString: `mysql://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}/yaot?ssl={"rejectUnauthorized":false}&sslcert=/etc/ssl/cert.pem`,
  },
  tablesFilter: ["lift_*"],
} satisfies Config
