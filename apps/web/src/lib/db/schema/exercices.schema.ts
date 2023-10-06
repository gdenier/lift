import { varchar } from "drizzle-orm/pg-core"
import { id, table } from "./utils"
import { z } from "zod"

//---- Entity
export const exercices = table("exercices", {
  id: id(),
  name: varchar("name", { length: 256 }).notNull(),
})

//---- Relations

//---- Types
export type Exercice = z.infer<typeof exerciceSchema>

//---- Schemas
export const exerciceSchema = z.object({
  id: z.string().ulid(),
  name: z.string(),
})
