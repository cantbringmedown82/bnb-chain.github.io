export function validateRouting(routing: string): boolean {
  return /^\d{9}$/.test(routing);
}

export function validateClassCode(code: string): boolean {
  return code === "PPD" || code === "CCD";
}
