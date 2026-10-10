import app from '../../src/app';
import assert from 'node:assert/strict';
import test from 'node:test';
import request from 'supertest';

test('GET /api/ping/database returns 200 with ok result', async () => {
  const response = await request(app).get('/api/ping/database');
  assert.equal(response.status, 200);
  assert.equal(response.body.result, 'database ok');
});

test('GET /api/ping/server returns 200 with ok result', async () => {
  const response = await request(app).get('/api/ping/server');
  assert.equal(response.status, 200);
  assert.equal(response.body.result, 'server ok');
});
