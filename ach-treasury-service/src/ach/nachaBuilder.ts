interface AchBatch {
  id: string;
  company_name: string;
}

interface AchEntry {
  id: string;
  rdfi_routing: string;
  amount_cents: number;
}

export function buildNachaFile(batch: AchBatch, entries: AchEntry[]): Buffer {
  // Minimal stub, replace with full NACHA formatting (94-char records, headers/controls)
  const header = `FILE for ${batch.company_name} (${batch.id})\n`;
  const body = entries.map((e) => `ENTRY ${e.id} ${e.rdfi_routing} ${e.amount_cents}`).join("\n");
  return Buffer.from(header + body, "utf8");
}
