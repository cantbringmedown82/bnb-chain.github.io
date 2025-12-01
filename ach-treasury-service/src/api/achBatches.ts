import { Router, Request, Response } from "express";
import { pool } from "../utils/db";
import { buildNachaFile } from "../ach/nachaBuilder";

const r = Router();

// Create batch
r.post("/api/ach/batches", async (req: Request, res: Response) => {
  const { companyName, companyId, odfiRouting, classCode, effectiveDate } = req.body || {};
  if (!companyName || !companyId || !odfiRouting || !classCode || !effectiveDate) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const q = `
    INSERT INTO ach_batch (company_name, company_id, odfi_routing, class_code, effective_entry_date, file_id_modifier, status)
    VALUES ($1,$2,$3,$4,$5,'A','prepared') RETURNING id
  `;
  const { rows } = await pool.query(q, [companyName, companyId, odfiRouting, classCode, effectiveDate]);
  return res.json({ ok: true, batchId: rows[0].id });
});

// Submit batch (stub)
r.post("/api/ach/batches/:id/submit", async (req: Request, res: Response) => {
  const { id } = req.params;
  const batchRes = await pool.query("SELECT * FROM ach_batch WHERE id=$1", [id]);
  if (!batchRes.rowCount) return res.status(404).json({ error: "Batch not found" });
  const entriesRes = await pool.query("SELECT * FROM ach_entry WHERE batch_id=$1 AND status='queued'", [id]);

  const file = buildNachaFile(batchRes.rows[0], entriesRes.rows);
  const fileHash = Buffer.from(file).toString("base64");
  const ackRef = `ACK-${Date.now()}`;

  await pool.query("UPDATE ach_batch SET status='submitted', file_hash=$2, ack_ref=$3 WHERE id=$1", [
    id, fileHash, ackRef
  ]);

  return res.json({ ok: true, batchId: id, ackRef });
});

// List batches
r.get("/api/ach/batches", async (_req: Request, res: Response) => {
  const { rows } = await pool.query("SELECT id, company_name, status, effective_entry_date, ack_ref FROM ach_batch ORDER BY created_at DESC LIMIT 100");
  return res.json(rows);
});

export default r;
