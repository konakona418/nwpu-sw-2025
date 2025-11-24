import { t } from 'elysia';

export namespace CommonModel {
  export const unauthorizedResponse = t.Object({
    message: t.Literal('Invalid credentials or the credentials are expired'),
  });

  export type unauthorizedResponse = typeof unauthorizedResponse.static;

  export const authorizationHeader = t.Object({
    'X-Authorization': t.String(),
  });

  export type authorizationHeader = typeof authorizationHeader.static;

  export type JwtPayload = {
    userId: number;
    email: string;
    iat: number;
  };
}
