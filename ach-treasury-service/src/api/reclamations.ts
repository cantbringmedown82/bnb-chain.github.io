import { Router, Request, Response } from "express";
import { pool } from "../utils/db";

const r = Router();

r.post("/api/ach/reclamations", async (req: Request, res: Response) => {
  const { entryId, description } = req.body || {};
  if (!entryId) return res.status(400).json({ error: "entryId required" });

  await pool.query(
    "INSERT INTO ach_exception (entry_id, type, code, description) VALUES ($1,'reclamation','RECL',$2)",
    [entryId, description || null]
  );
  await pool.query("UPDATE ach_entry SET status='reclaimed' WHERE id=$1", [entryId]);

  return res.json({ ok: true });
});

export default r;
