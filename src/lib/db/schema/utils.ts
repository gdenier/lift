import { customType, mysqlTableCreator } from "drizzle-orm/mysql-core"

export const table = mysqlTableCreator((name) => `lift_${name}`)

export const id = customType<{ data: string; notNull: true }>({
  dataType() {
    return "varchar(26)"
  },
})
