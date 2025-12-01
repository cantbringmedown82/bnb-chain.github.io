import { Router, Request, Response } from "express";
import { pool } from "../utils/db";

const r = Router();

r.post("/api/consents/ach", async (req: Request, res: Response) => {
  const { userId, documentHash, detachedSignature, metadata } = req.body || {};
  if (!userId || !documentHash || !detachedSignature) {
    return res.status(400).json({ error: "userId, documentHash, detachedSignature required" });
  }

  const { rows } = await pool.query(
    "INSERT INTO consent_artifact (user_id, type, document_hash, signature_detached, signed_at, metadata) VALUES ($1,'ach_debit',$2,$3,now(),$4) RETURNING id",
    [userId, documentHash, detachedSignature, metadata || null]
  );

  return res.json({ ok: true, consentId: rows[0].id });
});

r.post("/api/consents/:id/revoke", async (req: Request, res: Response) => {
  const { id } = req.params;
  await pool.query("UPDATE consent_artifact SET revoked_at=now() WHERE id=$1", [id]);
  return res.json({ ok: true });
});

export default r;
