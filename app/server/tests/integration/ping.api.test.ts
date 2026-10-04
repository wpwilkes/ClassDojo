import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import app from '../../src/app';

test('GET /api/ping returns 200 with ok status', async () => {
  const response = await request(app).get('/api/ping');

  assert.equal(response.status, 200);
  assert.deepEqual(response.body, {
    status: 'ok',
  });
});
