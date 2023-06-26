import { mysqlTableCreator } from "drizzle-orm/mysql-core";

export const table = mysqlTableCreator((name) => `lift_${name}`)