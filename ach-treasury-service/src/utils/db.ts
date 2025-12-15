import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DB_URL || "postgres://postgres:postgres@localhost:5432/ach"
});
