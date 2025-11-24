import { status } from 'elysia';
import { db } from '..';
import { AuthModel } from './model';

import { AuthUtil } from '../util/auth';

import jwt from 'jsonwebtoken';
import { CommonModel } from '../model';
import { CommonUtil } from '../util/common';

export abstract class AuthService {
  static async login({ email, password }: AuthModel.loginBody) {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw status(400, {
        message: 'User does not exist',
      } satisfies AuthModel.loginFailureResponse);
    }

    if (user.password !== password) {
      throw status(400, {
        message: 'Invalid credentials',
      } satisfies AuthModel.loginFailureResponse);
    }

    const { token, refreshToken } = await AuthUtil.generateToken(
      user.id,
      user.email
    );

    return {
      message: 'Login successful',
      token: token,
      refreshToken: refreshToken,
    } satisfies AuthModel.loginSuccessResponse;
  }

  static async refreshCredentials({
    refreshToken,
  }: AuthModel.refreshCredentialsBody) {
    const { userId, email, iat } =
      await AuthUtil.decodeToken<CommonModel.JwtPayload>(refreshToken).then(
        (result) => {
          if (result.isErr()) {
            throw status(401, CommonModel.unauthorizedResponse);
          }
          return result.value;
        }
      );

    if (!userId || !email || !iat) {
      throw status(401, CommonModel.unauthorizedResponse);
    }

    if (
      !(await CommonUtil.tokenIssuedAtIsValid(iat, CommonUtil.secondsOfDays(7)))
    ) {
      throw status(401, CommonModel.unauthorizedResponse);
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    const { token, refreshToken: newRefreshToken } =
      await AuthUtil.generateToken(decoded.userId, decoded.email);

    return {
      message: 'Credentials refreshed successfully',
      token: token,
      refreshToken: newRefreshToken,
    } satisfies AuthModel.refreshCredentialsSuccessResponse;
  }

  static async register({ email, password, username }: AuthModel.registerBody) {
    let user = await db.user.findUnique({
      where: { email },
    });
    if (user) {
      throw status(400, {
        message: 'Registration failed',
      } satisfies AuthModel.registerFailureResponse);
    }

    user = await db.user.create({
      data: {
        email,
        password,
        name: username,
        role: 'CUSTOMER',
      },
    });

    return {
      message: 'Registration successful',
    } satisfies AuthModel.registerSuccessResponse;
  }

  static async veryfyToken(token: string): Promise<boolean> {
    const result = await AuthUtil.decodeToken<CommonModel.JwtPayload>(token);
    return result.isOk();
  }
}
