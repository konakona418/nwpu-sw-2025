import { t } from 'elysia';

export namespace UserModel {
  export const updateUserPasswordBody = t.Object({
    oldPassword: t.String(),
    newPassword: t.String(),
  });

  export type updateUserPasswordBody = typeof updateUserPasswordBody.static;

  export const updateUserPasswordSuccessResponse = t.Object({
    message: t.Literal('Password updated successfully'),
  });

  export type updateUserPasswordSuccessResponse =
    typeof updateUserPasswordSuccessResponse.static;

  export const updateUserPasswordFailureResponse = t.Object({
    message: t.Union([
      t.Literal('Old password is incorrect'),
      t.Literal('User not found'),
    ]),
  });

  export type updateUserPasswordFailureResponse =
    typeof updateUserPasswordFailureResponse.static;

  export const updateUserRoleBody = t.Object({
    newRole: t.Union([
      t.Literal('CUSTOMER'),
      t.Literal('MERCHANT'),
      t.Literal('COURIER'),
      t.Literal('ADMIN'),
    ]),
  });

  export type updateUserRoleBody = typeof updateUserRoleBody.static;

  export const updateUserRoleSuccessResponse = t.Object({
    message: t.Literal('User role updated successfully'),
  });

  export type updateUserRoleSuccessResponse =
    typeof updateUserRoleSuccessResponse.static;

  export const updateUserRoleFailureResponse = t.Object({
    message: t.Union([
      t.Literal('User not found'),
      t.Literal('Not a valid user role: customer, merchant, courier'),
      t.Literal('You are not authorized to change your role to admin'),
    ]),
  });

  export type updateUserRoleFailureResponse =
    typeof updateUserRoleFailureResponse.static;
}
