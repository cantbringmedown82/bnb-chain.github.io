import { useEffect, useState } from "react";

export default function Evidence() {
  const [ledger, setLedger] = useState(null);

  useEffect(() => {
    fetch("/evidence-index")
      .then(r => r.json())
      .then(setLedger);
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Compliance Evidence</h1>
      {!ledger ? (
        <p>Loading…</p>
      ) : (
        <ul>
          {ledger.reports.map((r) => (
            <li key={r.report_date}>
              <strong>{r.report_date}</strong> — SHA-256: {r.sha256} — TX: {r.anchor_tx}
              {" "}
              <a href={`/reports/${r.file}`} target="_blank" rel="noreferrer">PDF</a>
              {" | "}
              <a href={`/reports/${r.signature}`} target="_blank" rel="noreferrer">Signature</a>
            </li>
          ))}
        </ul>
      )}
      <div style={{ marginTop: 24 }}>
        <iframe
          title="Grafana Dashboard"
          src={process.env.REACT_APP_GRAFANA_URL}
          width="100%" height="600" style={{ border: 0 }}
        />
      </div>
    </div>
  );
}
