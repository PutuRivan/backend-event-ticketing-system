import { OrdersV1Service } from './../services/orders-v1.service';
import { Body, Controller, Get, Param, Post, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthTypeEnum } from '../../../infrastructures/modules/jwt/enums/jwt-type.enum';
import { OrderPaginateV1Request } from '../dtos/requests/orders-paginate-v1.request';
import { IPaginateData } from '../../../shared/interfaces/paginate-response.interface';
import { OrderV1Response } from '../dtos/responses/orders-v1.response';
import { ordersCreateV1Request } from '../dtos/requests/orders-create-v1.request';
import { Roles } from '../../../shared/decorators/role.decorator';
import { RoleEnum } from '../../../shared/enums/role.enum';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import type { IUser } from '../../../infrastructures/databases/interfaces/user.interface';

@ApiTags('Orders')
@ApiBearerAuth(JwtAuthTypeEnum.AccessToken)
@Controller({ path: "orders", version: "1" })
export class OrdersV1Controller {
  constructor(
    private readonly ordersV1Service: OrdersV1Service
  ) { }

  // ================================================
  //                    ADMIN
  //=================================================
  @Roles(RoleEnum.ADMIN)
  @Get('')
  @ApiOperation({ summary: 'Get all orders (Admin)' })
  @ApiResponse({ status: 200 })
  async paginate(
    @Query() paginationDto: OrderPaginateV1Request
  ): Promise<IPaginateData<OrderV1Response>> {
    return await this.ordersV1Service.paginate(paginationDto)
  }

  // ================================================
  //                    AUTHENTICATE
  //=================================================

  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  @Get(':orderId')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: 200 })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  async orderById(
    @Param('orderId') orderId: string
  ): Promise<OrderV1Response> {
    const data = await this.ordersV1Service.findOneById(orderId)

    return OrderV1Response.MapEntity(data)
  }

  // ================================================
  //                    USER
  //=================================================

  @Roles(RoleEnum.USER)
  @Post('')
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201 })
  async createOrder(
    @CurrentUser() user: IUser,
    @Body() dataOrder: ordersCreateV1Request
  ): Promise<OrderV1Response> {
    const result = await this.ordersV1Service.createOrder(user.id, dataOrder)

    return OrderV1Response.MapEntity(result)
  }

  @Roles(RoleEnum.USER)
  @Post(':orderId/pay')
  @ApiOperation({ summary: 'Pay for an order' })
  @ApiResponse({ status: 201 })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  async paymentOrder(
    @Param('orderId') orderId: string
  ) {
    const data = await this.ordersV1Service.paymentOrder(orderId)

    return OrderV1Response.MapEntity(data)
  }

  @Roles(RoleEnum.USER)
  @Post(':orderId/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 201 })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  async cancelOrder(
    @Param('orderId') orderId: string
  ) {
    const data = await this.ordersV1Service.cancelOrder(orderId)

    return OrderV1Response.MapEntity(data)
  }
}