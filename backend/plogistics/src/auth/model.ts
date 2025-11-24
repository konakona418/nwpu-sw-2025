import { t } from 'elysia';

export namespace AuthModel {
  export const loginBody = t.Object({
    email: t.String(),
    password: t.String(),
  });

  export type loginBody = typeof loginBody.static;

  export const loginSuccessResponse = t.Object({
    message: t.Literal('Login successful'),
    token: t.String(),
    refreshToken: t.String(),
  });

  export type loginSuccessResponse = typeof loginSuccessResponse.static;

  export const loginFailureResponse = t.Object({
    message: t.Union([
      t.Literal('Invalid credentials'),
      t.Literal('User does not exist'),
    ]),
  });

  export type loginFailureResponse = typeof loginFailureResponse.static;

  export const refreshCredentialsBody = t.Object({
    refreshToken: t.String(),
  });

  export type refreshCredentialsBody = typeof refreshCredentialsBody.static;

  export const refreshCredentialsSuccessResponse = t.Object({
    message: t.Literal('Credentials refreshed successfully'),
    token: t.String(),
    refreshToken: t.String(),
  });

  export type refreshCredentialsSuccessResponse =
    typeof refreshCredentialsSuccessResponse.static;

  export const refreshCredentialsFailureResponse = t.Object({
    message: t.Literal('Invalid token'),
  });

  export type refreshCredentialsFailureResponse =
    typeof refreshCredentialsFailureResponse.static;

  export const registerBody = t.Object({
    email: t.String(),
    password: t.String(),
    username: t.String(),
  });

  export type registerBody = typeof registerBody.static;

  export const registerSuccessResponse = t.Object({
    message: t.Literal('Registration successful'),
  });

  export type registerSuccessResponse = typeof registerSuccessResponse.static;

  export const registerFailureResponse = t.Object({
    message: t.Literal('Registration failed'),
  });

  export type registerFailureResponse = typeof registerFailureResponse.static;
}
