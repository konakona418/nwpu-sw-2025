import { t } from 'elysia';
import {
  OrderPlain,
  OrderPlainInputCreate,
} from '../generated/prismabox/Order';
import { MerchantItemPlain } from '../generated/prismabox/MerchantItem';
import { UserPlain } from '../generated/prismabox/User';
import { MerchantPlain } from '../generated/prismabox/Merchant';
import { CourierPlain } from '../generated/prismabox/Courier';

export namespace OrderModel {
  export const placeOrderBody = t.Object({
    merchantId: t.Number(),
    customerId: t.Number(),
    ...t.Omit(OrderPlainInputCreate, ['status']).properties,
    items: t.Array(
      t.Object({
        id: t.Number(),
      })
    ),
  });

  export type placeOrderBody = typeof placeOrderBody.static;

  export const placeOrderSuccessResponse = t.Object({
    message: t.Literal('Order placed successfully'),
    orderId: t.Number(),
  });

  export type placeOrderSuccessResponse =
    typeof placeOrderSuccessResponse.static;

  export const placeOrderFailureResponse = t.Object({
    message: t.Union([t.Literal('Order not found')]),
  });

  export type placeOrderFailureResponse =
    typeof placeOrderFailureResponse.static;

  export const getOrderInfoParams = t.Object({
    orderId: t.Number(),
  });

  export type getOrderInfoParams = typeof getOrderInfoParams.static;

  export const getOrderInfoSuccessResponse = t.Object({
    message: t.Literal('Order retrieved successfully'),
    ...OrderPlain.properties,
    items: t.Array(MerchantItemPlain),
    merchant: t.Object({
      ...UserPlain.properties,
      ...MerchantPlain.properties,
    }),
    customer: UserPlain,
    courier: t.Nullable(
      t.Object({
        ...UserPlain.properties,
        ...CourierPlain.properties,
      })
    ),
  });

  export type getOrderInfoSuccessResponse =
    typeof getOrderInfoSuccessResponse.static;
}
