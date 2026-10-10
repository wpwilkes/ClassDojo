import assert from 'node:assert/strict';
import test from 'node:test';

import {
  pingDatabaseService,
  pingServerService,
} from '../../../src/services/ping.service';

test('pingServerService returns a timestamp', () => {
  const timestamp = pingServerService();

  assert.equal(Number.isNaN(Date.parse(timestamp)), false);
});

test('pingDatabaseService returns repository timestamp', async () => {
  const fakeRepository = async (): Promise<string> =>
    '2026-10-09T12:00:00.000Z';

  const timestamp = await pingDatabaseService(fakeRepository);

  assert.equal(timestamp, '2026-10-09T12:00:00.000Z');
});
