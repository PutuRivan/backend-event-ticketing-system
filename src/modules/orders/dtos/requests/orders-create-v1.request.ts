import { z } from "zod";
import { ZodUtils } from "../../../../shared/utils/zod.util";
import { OrderStatusEnum } from "../../../../shared/enums/order-status.enum";

export const ordersCreateV1Schema = z.object({
  userId: z.string(),
  eventId: z.string(),
  quantity: z.number().int().positive(),
})

export class ordersCreateV1Request extends ZodUtils.createCamelCaseDto(
  ordersCreateV1Schema
) { }