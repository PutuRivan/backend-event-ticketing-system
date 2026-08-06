import { OrdersV1Service } from './../services/orders-v1.service';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Request } from "@nestjs/common";
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
import { IOrder } from '../../../infrastructures/databases/interfaces/order.interface';

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
    const result = await this.ordersV1Service.paginate(paginationDto)

    return {
      meta: result.meta,
      items: OrderV1Response.MapEntities(result.items)
    }
  }

  // ================================================
  //                    USER
  //=================================================

  @Roles(RoleEnum.USER)
  @Get('me')
  @ApiOperation({ summary: 'Get all orders User Login' })
  @ApiResponse({ status: 200 })
  async paginateUser(
    @CurrentUser() user: IUser,
    @Query() paginationDto: OrderPaginateV1Request
  ): Promise<IPaginateData<OrderV1Response>> {
    const result = await this.ordersV1Service.paginateByUserId(user.id, paginationDto)

    return {
      meta: result.meta,
      items: OrderV1Response.MapEntities(result.items)
    }
  }

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
    @CurrentUser() user: IUser,
    @Param('orderId') orderId: string
  ) {
    const data = await this.ordersV1Service.paymentOrder(user.id, orderId)

    return OrderV1Response.MapEntity(data)
  }

  @Roles(RoleEnum.USER)
  @Post(':orderId/cancel')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: 200 })
  @HttpCode(HttpStatus.OK)
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  async cancelOrder(
    @CurrentUser() user: IUser,
    @Param('orderId') orderId: string
  ) {
    const data = await this.ordersV1Service.cancelOrder(user.id, orderId)

    return OrderV1Response.MapEntity(data)
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
    @CurrentUser() user: IUser,
    @Param('orderId') orderId: string
  ): Promise<OrderV1Response> {
    const data = await this.ordersV1Service.findOneByIdWithPermission(orderId, user)

    return OrderV1Response.MapEntity(data)
  }
}