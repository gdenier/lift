import { sql } from "drizzle-orm";
import {customType, pgTableCreator} from "drizzle-orm/pg-core"

export const table = pgTableCreator((name) => `lift_${name}`)

const idType = customType<{ data: string; notNull: true; default: true }>({
  dataType() {
    return "ulid"
  },
})

export function id(config?: {primary?: boolean, null?: boolean, default?: boolean}) {
  let id = idType("id")
  if(config?.primary || config?.primary === undefined)
    id = id.primaryKey()
  if(config?.null || config?.null === undefined)
    id = id.notNull()
  if(config?.default || config?.default === undefined)
    id = id.default(sql`gen_ulid()`)
  return id
} 

export function foreign_id(name: string) {
  return idType(name)
}