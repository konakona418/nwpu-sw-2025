import { Elysia } from 'elysia';

import { AuthService } from './service';
import { AuthModel } from './model';

export const auth = new Elysia({ prefix: '/auth' })
  .post(
    '/login',
    async ({ body }) => {
      return await AuthService.login(body);
    },
    {
      body: AuthModel.loginBody,
      response: {
        200: AuthModel.loginSuccessResponse,
        400: AuthModel.loginFailureResponse,
      },
    }
  )
  .post(
    '/refreshCredentials',
    async ({ body }) => {
      return await AuthService.refreshCredentials(body);
    },
    {
      body: AuthModel.refreshCredentialsBody,
      response: {
        200: AuthModel.refreshCredentialsSuccessResponse,
        400: AuthModel.refreshCredentialsFailureResponse,
      },
    }
  )
  .post(
    '/register',
    async ({ body }) => {
      return await AuthService.register(body);
    },
    {
      body: AuthModel.registerBody,
      response: {
        200: AuthModel.registerSuccessResponse,
        400: AuthModel.registerFailureResponse,
      },
    }
  );
