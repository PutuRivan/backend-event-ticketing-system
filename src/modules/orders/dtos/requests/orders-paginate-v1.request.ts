import { z } from "zod";
import { PaginateSchema } from "../../../../shared/dtos/requests/paginate.request";
import { OrderStatusEnum } from "../../../../shared/enums/order-status.enum";
import { ZodUtils } from "../../../../shared/utils/zod.util";

export const orderPaginateV1Schema = PaginateSchema.extend({
  status: z.enum(OrderStatusEnum).default(OrderStatusEnum.PAID)
})

export class OrderPaginateV1Request extends ZodUtils.createCamelCaseDto(
  orderPaginateV1Schema
) { }