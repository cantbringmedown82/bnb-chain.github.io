import { Router, Request, Response } from "express";
import { pool } from "../utils/db";

const r = Router();

r.post("/api/ach/returns", async (req: Request, res: Response) => {
  const { entryId, code, description } = req.body || {};
  if (!entryId || !code) return res.status(400).json({ error: "entryId and code required" });

  await pool.query(
    "INSERT INTO ach_exception (entry_id, type, code, description) VALUES ($1,'return',$2,$3)",
    [entryId, code, description || null]
  );
  await pool.query(
    "UPDATE ach_entry SET status='returned', return_code=$2 WHERE id=$1",
    [entryId, code]
  );

  return res.json({ ok: true });
});

export default r;
