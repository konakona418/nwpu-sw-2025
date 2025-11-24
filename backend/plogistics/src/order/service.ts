import { status } from 'elysia';
import { db } from '..';
import { CommonModel } from '../model';
import { AuthUtil } from '../util/auth';
import { OrderModel } from './model';

export abstract class OrderService {
  static async placeOrder(
    body: OrderModel.placeOrderBody,
    { authorization }: CommonModel.authorizationHeader
  ) {
    const userId = await AuthUtil.decodeToken<CommonModel.JwtPayload>(
      authorization
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
        status: 'PENDING',
        items: { connect: body.items.map((item) => ({ id: item.id })) },
      },
    });

    return {
      message: 'Order placed successfully',
      orderId: order.id,
    } satisfies OrderModel.placeOrderSuccessResponse;
  }

  static async getOrderInfo(
    params: OrderModel.getOrderInfoParams,
    { authorization }: CommonModel.authorizationHeader
  ) {
    const { userId, isAdmin } =
      await AuthUtil.decodeToken<CommonModel.JwtPayload>(authorization).then(
        (result) => {
          if (result.isErr()) {
            throw status(401, CommonModel.unauthorizedResponse);
          }

          return {
            userId: result.value.userId,
            isAdmin: result.value.role === 'ADMIN',
          };
        }
      );

    const order = await db.order.findUnique({
      where: { id: params.orderId },
      include: {
        items: true,
        merchant: {
          include: {
            user: true,
          },
        },
        customer: true,
        courier: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!order) {
      throw status(400, {
        message: 'Order not found',
      } satisfies OrderModel.placeOrderFailureResponse);
    }

    if (
      order.merchantId !== userId &&
      order.customerId !== userId &&
      order.courierId !== userId &&
      !isAdmin
    ) {
      throw status(401, CommonModel.unauthorizedResponse);
    }

    return {
      message: 'Order retrieved successfully',
      ...order,
      totalAmount: order.totalAmount.toNumber(),
      merchant: {
        ...order.merchant.user,
        ...order.merchant,
      },
      customer: order.customer,
      courier: order.courier && {
        ...order.courier.user,
        ...order.courier,
      },
    } satisfies OrderModel.getOrderInfoSuccessResponse;
  }
}
