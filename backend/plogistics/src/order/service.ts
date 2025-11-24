import { status } from 'elysia';
import { db } from '..';
import { CommonModel } from '../model';
import { AuthUtil } from '../util/auth';
import { OrderModel } from './model';

export abstract class OrderService {
  static async placeOrder(
    body: OrderModel.placeOrderBody,
    authorization: CommonModel.authorizationHeader
  ) {
    const userId = await AuthUtil.decodeToken<CommonModel.JwtPayload>(
      authorization['X-Authorization']
    ).then((result) => {
      if (result.isErr()) {
        throw status(401, CommonModel.unauthorizedResponse);
      }
      return result.value.userId;
    });

    const order = await db.order.create({
      data: {
        ...body,
        customerId: userId,
      },
    });

    return {
      message: 'Order placed successfully',
      orderId: order.id,
    } satisfies OrderModel.placeOrderSuccessResponse;
  }
}
