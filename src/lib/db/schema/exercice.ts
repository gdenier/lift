import { serial, varchar } from "drizzle-orm/mysql-core"
import { table } from "./utils"

export const exercices = table("exercices", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }),
})
