import { describe, expect, it } from 'bun:test';
import { edenTreaty } from '@elysiajs/eden';

import { App, appLocalPort } from '../src/index.js';

const address = `localhost:${appLocalPort}`;
const client = edenTreaty<App>(address);

describe('index test', () => {
  it('test health', async () => {
    const response = await client.health.get();
    expect(response.status).toBe(200);
    expect(response.data).toBe('OK');
  });
});
