import { z } from "zod";
import { ZodUtils } from "../../../../shared/utils/zod.util";

export const ordersCreateV1Schema = z.object({
  eventId: z.string(),
  quantity: z.number().int().positive(),
})

export class ordersCreateV1Request extends ZodUtils.createCamelCaseDto(
  ordersCreateV1Schema
) { }