-- ACH Treasury Service Database Schema

-- ACH Batches
CREATE TABLE IF NOT EXISTS ach_batch (
  id SERIAL PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  company_id VARCHAR(10) NOT NULL,
  odfi_routing VARCHAR(9) NOT NULL,
  class_code VARCHAR(3) NOT NULL,
  effective_entry_date DATE NOT NULL,
  file_id_modifier CHAR(1) DEFAULT 'A',
  status VARCHAR(20) DEFAULT 'prepared',
  file_hash TEXT,
  ack_ref VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ACH Entries
CREATE TABLE IF NOT EXISTS ach_entry (
  id SERIAL PRIMARY KEY,
  batch_id INTEGER REFERENCES ach_batch(id),
  transaction_code VARCHAR(2) NOT NULL,
  rdfi_routing VARCHAR(9) NOT NULL,
  account_number VARCHAR(17) NOT NULL,
  amount_cents BIGINT NOT NULL,
  individual_name VARCHAR(22),
  individual_id VARCHAR(15),
  addenda TEXT,
  status VARCHAR(20) DEFAULT 'queued',
  return_code VARCHAR(4),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ACH Exceptions (returns, reclamations)
CREATE TABLE IF NOT EXISTS ach_exception (
  id SERIAL PRIMARY KEY,
  entry_id INTEGER REFERENCES ach_entry(id),
  type VARCHAR(20) NOT NULL,
  code VARCHAR(10) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Consent Artifacts
CREATE TABLE IF NOT EXISTS consent_artifact (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  document_hash VARCHAR(64) NOT NULL,
  signature_detached TEXT NOT NULL,
  signed_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ach_batch_status ON ach_batch(status);
CREATE INDEX IF NOT EXISTS idx_ach_entry_batch_id ON ach_entry(batch_id);
CREATE INDEX IF NOT EXISTS idx_ach_entry_status ON ach_entry(status);
CREATE INDEX IF NOT EXISTS idx_ach_exception_entry_id ON ach_exception(entry_id);
CREATE INDEX IF NOT EXISTS idx_consent_artifact_user_id ON consent_artifact(user_id);
