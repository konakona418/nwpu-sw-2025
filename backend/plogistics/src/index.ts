import { Elysia } from 'elysia';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

import { auth } from './auth/index.js';
import { user } from './user';

const port = Number.isNaN(Number(process.env.PORT))
  ? 3000
  : Number(process.env.PORT);

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter: pool });

export { db };

const app = new Elysia()
  .get('/', () => 'Hello Elysia')
  .get('/health', ({ status }) => status(200, 'OK'))
  .use(auth)
  .use(user)
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
export const appLocalPort = port;
