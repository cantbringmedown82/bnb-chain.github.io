import { Router, Request, Response } from "express";
import { buildCompliancePack } from "../compliance/packGenerator";

const r = Router();

r.post("/api/packs/generate", async (req: Request, res: Response) => {
  const { from, to } = req.body || {};
  const packId = await buildCompliancePack(from, to);
  return res.json({ ok: true, packId });
});

export default r;
