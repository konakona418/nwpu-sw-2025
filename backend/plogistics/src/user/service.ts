import { status } from 'elysia';
import { db } from '..';
import { UserModel } from './model';

import { CommonModel } from '../model';
import { AuthUtil } from '../util/auth';

export abstract class UserService {
  private static async getUserIdFromAuthorizationHeader(
    jwt: string
  ): Promise<number> {
    const { userId } = await AuthUtil.decodeToken<CommonModel.JwtPayload>(
      jwt
    ).then((result) => {
      if (result.isErr()) {
        throw status(401, CommonModel.unauthorizedResponse);
      }
      return result.value;
    });
    return userId;
  }
  static async updateUserPassword(
    { oldPassword, newPassword }: UserModel.updateUserPasswordBody,
    { 'X-Authorization': authorization }: CommonModel.authorizationHeader
  ) {
    const userId = await this.getUserIdFromAuthorizationHeader(authorization);

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.password !== oldPassword) {
      throw status(400, { message: 'Invalid old password' });
    }

    await db.user.update({
      where: { id: userId },
      data: { password: newPassword },
    });

    return {
      message: 'Password updated successfully',
    } satisfies UserModel.updateUserPasswordSuccessResponse;
  }

  static async updateUserRole(
    { newRole }: UserModel.updateUserRoleBody,
    { 'X-Authorization': authorization }: CommonModel.authorizationHeader
  ) {
    if (newRole === 'ADMIN') {
      throw status(400, {
        message: 'You are not authorized to change your role to admin',
      } satisfies UserModel.updateUserRoleFailureResponse);
    }

    const userId = await this.getUserIdFromAuthorizationHeader(authorization);

    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw status(400, {
        message: 'User not found',
      } satisfies UserModel.updateUserRoleFailureResponse);
    }

    await db.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return {
      message: 'User role updated successfully',
    } satisfies UserModel.updateUserRoleSuccessResponse;
  }
}
