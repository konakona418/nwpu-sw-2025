import { Elysia } from 'elysia';

import { UserModel } from './model';
import { CommonModel } from '../model';
import { UserService } from './service';

export const user = new Elysia({ prefix: '/user' })
  .post(
    'updatePassword',
    async ({ body, headers }) => {
      return await UserService.updateUserPassword(body, headers);
    },
    {
      headers: CommonModel.authorizationHeader,
      body: UserModel.updateUserPasswordBody,
      response: {
        200: UserModel.updateUserPasswordSuccessResponse,
        400: UserModel.updateUserPasswordFailureResponse,
        401: CommonModel.unauthorizedResponse,
      },
    }
  )
  .post(
    'updateRole',
    async ({ body, headers }) => {
      return await UserService.updateUserRole(body, headers);
    },
    {
      headers: CommonModel.authorizationHeader,
      body: UserModel.updateUserRoleBody,
      response: {
        200: UserModel.updateUserRoleSuccessResponse,
        400: UserModel.updateUserRoleFailureResponse,
        401: CommonModel.unauthorizedResponse,
      },
    }
  )
  .get(
    'profile/:userId?',
    async ({ params, headers }) => {
      return await UserService.getUserProfile(params, headers);
    },
    {
      params: UserModel.getUserProfileParams,
      headers: CommonModel.authorizationHeader,
      response: {
        200: UserModel.getUserProfileSuccessResponse,
        400: UserModel.getUserModelFailureResponse,
        401: CommonModel.unauthorizedResponse,
      },
    }
  );
