import { z } from "zod";
import { ZodUtils } from "../../../../shared/utils/zod.util";

export const eventCreateV1Schema = z.object({
  categoryId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  location: z.string(),
  eventDate: z.coerce.date(),
  ticketPrice: z.number(),
  quota: z.number(),
  published: z.boolean(),
})

export class eventCreateV1Request extends ZodUtils.createCamelCaseDto(
  eventCreateV1Schema
) { }