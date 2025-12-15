import { Router, Request, Response } from "express";
import { formsCatalog } from "../forms/catalog";

const r = Router();

r.get("/api/forms/catalog", (_req: Request, res: Response) => {
  return res.json(formsCatalog);
});

// Stub generation: you will implement PDF autofill + flattening later
r.post("/api/forms/:id/generate", (req: Request, res: Response) => {
  const { id } = req.params;
  const form = formsCatalog.find(f => f.id === id);
  if (!form) return res.status(404).json({ error: "Form not found" });
  return res.json({ ok: true, formId: id, hash: "TODO_HASH_GENERATED" });
});

export default r;
