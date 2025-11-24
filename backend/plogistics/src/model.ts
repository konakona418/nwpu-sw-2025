import { t } from 'elysia';

export namespace CommonModel {
  export const unauthorizedResponse = t.Object({
    message: t.Literal(
      'Invalid credentials or the credentials are expired, or you have no access to this resource'
    ),
  });

  export type unauthorizedResponse = typeof unauthorizedResponse.static;

  export const authorizationHeader = t.Object({
    authorization: t.Optional(t.String()),
  });

  export type authorizationHeader = typeof authorizationHeader.static;

  export type JwtPayload = {
    userId: number;
    email: string;
    iat: number;
    role?: 'ADMIN' | 'USER';
  };
}
