import { varchar } from "drizzle-orm/mysql-core"
import { id, table } from "./utils"
import { InferModel } from "drizzle-orm"

export const exercices = table("exercices", {
  id: id("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
})

export type Exercice = InferModel<typeof exercices>
