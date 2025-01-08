import { drizzle } from "drizzle-orm/postgres-js";
import * as orm from "drizzle-orm";
import postgres from "postgres";
export type { RowList } from "postgres";

import * as schema from "./schema";
import { env } from "./env";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

const db = drizzle(conn, { schema });

export { db, schema, orm };

export type Db = typeof db;
