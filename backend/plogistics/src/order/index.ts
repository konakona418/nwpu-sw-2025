import { Elysia } from 'elysia';

import { OrderModel } from './model';
import { CommonModel } from '../model';
import { OrderService } from './service';

export const order = new Elysia({ prefix: '/order' }).post(
  'placeOrder',
  async ({ body, headers }) => {
    return await OrderService.placeOrder(body, headers);
  },
  {
    body: OrderModel.placeOrderBody,
    headers: CommonModel.authorizationHeader,
    response: {
      200: OrderModel.placeOrderSuccessResponse,
      400: OrderModel.placeOrderFailureResponse,
      401: CommonModel.unauthorizedResponse,
    },
  }
);
