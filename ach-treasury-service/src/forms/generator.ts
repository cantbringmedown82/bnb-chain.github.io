export async function generateForm(id: string, data: Record<string, string>): Promise<{ id: string; hash: string; path: string }> {
  // Implement PDF autofill + flattening; return hash and storage path
  return { id, hash: "TODO_HASH", path: `/forms/${id}.pdf` };
}
