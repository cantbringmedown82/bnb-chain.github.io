/**
 * Tests for server.js
 */

const { isValidEntry, ensureEvidenceFile, app } = require('../server');
const request = require('supertest');
const fs = require('fs').promises;
const path = require('path');

describe('Evidence Entry Validation', () => {
  test('valid entry returns true', () => {
    const entry = {
      report_date: '2024-01-01',
      sha256: 'abc123def456',
      file: 'report.json',
      signature: 'sig123',
      anchor_tx: '0x123',
    };
    expect(isValidEntry(entry)).toBe(true);
  });

  test('missing required field returns false', () => {
    const entry = {
      report_date: '2024-01-01',
      sha256: 'abc123def456',
      // missing file, signature, anchor_tx
    };
    expect(isValidEntry(entry)).toBe(false);
  });

  test('empty string field returns false', () => {
    const entry = {
      report_date: '',
      sha256: 'abc123def456',
      file: 'report.json',
      signature: 'sig123',
      anchor_tx: '0x123',
    };
    expect(isValidEntry(entry)).toBe(false);
  });

  test('null entry returns false', () => {
    expect(isValidEntry(null)).toBe(false);
  });

  test('non-object entry returns false', () => {
    expect(isValidEntry('string')).toBe(false);
    expect(isValidEntry(123)).toBe(false);
    expect(isValidEntry([])).toBe(false);
  });
});

describe('Health Endpoints', () => {
  test('GET /healthz returns ok', async () => {
    const response = await request(app).get('/healthz');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });

  test('GET /readyz returns config status', async () => {
    const response = await request(app).get('/readyz');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('slack');
    expect(response.body).toHaveProperty('smtp');
    expect(response.body).toHaveProperty('trusteesEnabled');
  });
});

describe('Evidence Index Endpoint', () => {
  const EVIDENCE_PATH = path.join(__dirname, '..', 'deploy', 'reports', 'compliance-evidence-index.json');

  beforeAll(async () => {
    // Ensure test evidence file exists
    await fs.mkdir(path.dirname(EVIDENCE_PATH), { recursive: true });
    await fs.writeFile(EVIDENCE_PATH, JSON.stringify({ reports: [] }), 'utf8');
  });

  test('GET /evidence-index returns evidence data', async () => {
    const response = await request(app).get('/evidence-index');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('reports');
    expect(Array.isArray(response.body.reports)).toBe(true);
  });
});

describe('Admin Routes', () => {
  const ADMIN_KEY = 'test-admin-key';

  beforeAll(() => {
    process.env.ADMIN_API_KEY = ADMIN_KEY;
  });

  test('GET /admin/health without key returns 401', async () => {
    const response = await request(app).get('/admin/health');
    expect(response.status).toBe(401);
  });

  test('GET /admin/health with key returns ok', async () => {
    const response = await request(app)
      .get('/admin/health')
      .set('x-admin-api-key', ADMIN_KEY);
    expect(response.status).toBe(200);
    expect(response.body.ok).toBe(true);
  });

  test('GET /admin/status/compliance returns status', async () => {
    const response = await request(app)
      .get('/admin/status/compliance')
      .set('x-admin-api-key', ADMIN_KEY);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('anchors');
    expect(response.body).toHaveProperty('notifiers');
    expect(response.body).toHaveProperty('mode');
  });

  test('POST /admin/trigger/test-digest triggers digest', async () => {
    const response = await request(app)
      .post('/admin/trigger/test-digest')
      .set('x-admin-api-key', ADMIN_KEY)
      .send({ channel: 'all' });
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
