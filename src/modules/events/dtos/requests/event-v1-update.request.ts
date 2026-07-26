import { z } from "zod";
import { ZodUtils } from "../../../../shared/utils/zod.util";

export const eventUpdateV1Schema = z.object({
  categoryId: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  eventDate: z.string().datetime().optional(),
  ticketPrice: z.number().optional(),
  quota: z.number().optional(),
})

export class EventUpdateV1Request extends ZodUtils.createCamelCaseDto(
  eventUpdateV1Schema
) { }