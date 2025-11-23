import { Elysia } from 'elysia';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter: pool });

export { db };

const app = new Elysia()
  .get('/', () => 'Hello Elysia')
  .get('/health', ({ status }) => status(200, 'OK'))
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;
export const appLocalPort = port;
