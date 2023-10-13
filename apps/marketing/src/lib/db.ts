import { drizzle } from "drizzle-orm/neon-http";
import { neon, neonConfig } from "@neondatabase/serverless";
import {
  customType,
  pgTableCreator,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

neonConfig.fetchConnectionCache = true;

export const table = pgTableCreator((name) => `lift_${name}`);

export const ulid = customType<{
  data: string;
  notNull: true;
  default: true;
}>({
  dataType() {
    return "ulid";
  },
});

export function id(config?: {
  primary?: boolean;
  null?: boolean;
  default?: boolean;
}) {
  let id = ulid("id");
  if (config?.primary || config?.primary === undefined) id = id.primaryKey();
  if (config?.null || config?.null === undefined) id = id.notNull();
  if (config?.default || config?.default === undefined)
    id = id.default(sql`gen_ulid()`);
  return id;
}

export const pre_inscriptions = table("pre_inscriptions", {
  id: id(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  email: varchar("email").notNull().unique(),
});

const sql_neon = neon(import.meta.env.DRIZZLE_DATABASE_URL!);

export const db = drizzle(sql_neon, {
  logger: true,
});
