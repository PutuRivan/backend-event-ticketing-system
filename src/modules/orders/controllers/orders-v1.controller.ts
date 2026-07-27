import { OrdersV1Service } from './../services/orders-v1.service';
import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OrderPaginateV1Request } from '../dtos/requests/orders-paginate-v1.request';
import { IPaginateData } from '../../../shared/interfaces/paginate-response.interface';
import { OrderV1Response } from '../dtos/responses/orders-v1.response';
import { ordersCreateV1Request } from '../dtos/requests/orders-create-v1.request';
import { Roles } from '../../../shared/decorators/role.decorator';
import { RoleEnum } from '../../../shared/enums/role.enum';

@ApiTags('Orders')
@Controller({ path: "orders", version: "1" })

export class OrdersV1Controller {
  constructor(
    private readonly ordersV1Service: OrdersV1Service
  ) { }

  @Roles(RoleEnum.ADMIN)
  @Get('')
  async paginate(
    @Param() paginationDto: OrderPaginateV1Request
  ): Promise<IPaginateData<OrderV1Response>> {
    return await this.ordersV1Service.paginate(paginationDto)
  }

  @Roles(RoleEnum.USER)
  @Post('')
  async createOrder(
    @Body() dataOrder: ordersCreateV1Request
  ): Promise<OrderV1Response> {
    const result = await this.ordersV1Service.createOrder(dataOrder)

    return OrderV1Response.MapEntity(result)
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get(':orderId')
  async orderById(
    @Param('orderId') orderId: string
  ): Promise<OrderV1Response> {
    const data = await this.ordersV1Service.findOneById(orderId)

    return OrderV1Response.MapEntity(data)
  }

  @Roles(RoleEnum.USER)
  @Post(':orderId/pay')
  async paymentOrder(
    @Param('orderId') orderId: string
  ) {
    const data = await this.ordersV1Service.paymentOrder(orderId)

    return OrderV1Response.MapEntity(data)
  }

  @Roles(RoleEnum.USER)
  @Post(':orderId/cancel')
  async cancelOrder(
    @Param('orderId') orderId: string
  ) {
    const data = await this.ordersV1Service.cancelOrder(orderId)

    return OrderV1Response.MapEntity(data)
  }
}