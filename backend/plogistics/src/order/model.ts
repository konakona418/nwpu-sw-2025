import { t } from 'elysia';
import { OrderPlainInputCreate } from '../generated/prismabox/Order';

export namespace OrderModel {
  export const placeOrderBody = t.Object({
    ...OrderPlainInputCreate.properties,
    merchantId: t.Number(),
  });

  export type placeOrderBody = typeof placeOrderBody.static;

  export const placeOrderSuccessResponse = t.Object({
    message: t.Literal('Order placed successfully'),
    orderId: t.Number(),
  });

  export type placeOrderSuccessResponse =
    typeof placeOrderSuccessResponse.static;

  export const placeOrderFailureResponse = t.Object({
    message: t.Union([
      t.Literal('Insufficient stock for one or more items'),
      t.Literal('Invalid order details'),
    ]),
  });

  export type placeOrderFailureResponse =
    typeof placeOrderFailureResponse.static;
}
