type Incident = {
  id: string;
  level: "L1" | "L2" | "L3";
  reason: string;
  details: Record<string, unknown>;
  timestamp: string;
};

export function recordIncident(incident: Incident): void {
  // Persist to your append-only incident store (stub)
  console.log("INCIDENT", JSON.stringify(incident));
}
