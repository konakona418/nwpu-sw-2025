import { describe, expect, it, beforeEach } from 'bun:test';
import { treaty } from '@elysiajs/eden';

import { App, appLocalPort } from '../src/index.js';

let token: string | null = null;

const address = `localhost:${appLocalPort}`;
const client = treaty<App>(address, {
  onRequest(_path, _options) {
    return {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  },
});

beforeEach(async () => {
  // register a new user before each test
  const randomUsername = `testuser_${Math.floor(Math.random() * 100000)}`;
  const randomEmail = `test_${Math.floor(Math.random() * 100000)}@example.com`;
  const randomPassword = `password_${Math.floor(Math.random() * 100000)}`;

  const registerResponse = await client.auth.register.post({
    email: randomEmail,
    password: randomPassword,
    username: randomUsername,
  });
  expect(registerResponse.status).toBe(200);
  const loginResponse = await client.auth.login.post({
    email: randomEmail,
    password: randomPassword,
  });
  expect(loginResponse.status).toBe(200);
  token = loginResponse.data!.token;
});

describe('user test', () => {
  it('test get user profile', async () => {
    const response = await client.user.profile.get();
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('email');
    expect(response.data).toHaveProperty('name');
    console.log('User Profile:', response.data);
  });
});
