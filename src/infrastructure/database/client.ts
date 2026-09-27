import "server-only";
import { Pool, type PoolConfig, type QueryResultRow } from "pg";
import { databaseConfig } from "@/config/server";
import { requireCloudMode } from "@/config/integrations";

export interface SqlExecutor {
  query<T extends QueryResultRow = QueryResultRow>(text: string, values?: unknown[]): Promise<T[]>;
}
export interface Database extends SqlExecutor {
  transaction<T>(work: (sql: SqlExecutor) => Promise<T>, mode?: "read" | "write"): Promise<T>;
  close(): Promise<void>;
}

export function createDatabase(config: PoolConfig): Database {
  const pool = new Pool({ max: 2, connectionTimeoutMillis: 5000, idleTimeoutMillis: 10000, statement_timeout: 5000, ...config });
  // Never log errors containing connection strings, query text or request data.
  pool.on("error", () => console.error(JSON.stringify({ event: "database.pool_error" })));
  return {
    async query<T extends QueryResultRow>(text: string, values?: unknown[]) { return (await pool.query<T>(text, values)).rows; },
    async transaction(work, mode = "write") {
      const client = await pool.connect();
      let broken = false;
      try {
        await client.query(mode === "read" ? "BEGIN ISOLATION LEVEL REPEATABLE READ READ ONLY" : "BEGIN");
        const sql: SqlExecutor = { async query<T extends QueryResultRow>(text: string, values?: unknown[]) { return (await client.query<T>(text, values)).rows; } };
        const result = await work(sql);
        await client.query("COMMIT");
        return result;
      } catch (error) {
        try { await client.query("ROLLBACK"); } catch { broken = true; }
        throw error;
      } finally { client.release(broken); }
    },
    close: () => pool.end(),
  };
}

let database: Database | undefined;
export function getDatabase(): Database { requireCloudMode(); return database ??= createDatabase(databaseConfig()); }
