import { describe, expect, it, beforeAll } from 'bun:test';
import { treaty } from '@elysiajs/eden';

import { App, appLocalPort } from '../src/index.js';

const address = `localhost:${appLocalPort}`;
const client = treaty<App>(address);

let email: string | null = null;
let password: string | null = null;

async function registerTestUser() {
  const randomUsername = `testuser_${Math.floor(Math.random() * 100000)}`;
  const randomEmail = `test_${Math.floor(Math.random() * 100000)}@example.com`;
  const randomPassword = `password_${Math.floor(Math.random() * 100000)}`;

  const response = await client.auth.register.post({
    email: randomEmail,
    password: randomPassword,
    username: randomUsername,
  });
  expect(response.status).toBe(200);

  email = randomEmail;
  password = randomPassword;
}

beforeAll(async () => {
  await registerTestUser();
});

describe('auth test', () => {
  it('test login after register', async () => {
    const response = await client.auth.login.post({
      email: email!,
      password: password!,
    });
    console.log(response.error?.value);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('token');
    expect(response.data).toHaveProperty('refreshToken');
  });

  it('test refresh credentials', async () => {
    const { refreshToken } = await client.auth.login
      .post({
        email: email!,
        password: password!,
      })
      .then((res) => res.data!);

    const response = await client.auth.refreshCredentials.post({
      refreshToken: refreshToken,
    });
    console.log(response.error?.value);
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('token');
    expect(response.data).toHaveProperty('refreshToken');
  });
});
