import { z } from "zod";
import { PaginateSchema } from "../../../../shared/dtos/requests/paginate.request";
import { ZodUtils } from "../../../../shared/utils/zod.util";

export const eventPaginateV1Schema = PaginateSchema.extend({
  eventDate: z.string().datetime().optional(),
  published: z.boolean().optional(),
  categoryId: z.string().optional()
})

export class EventPaginateV1Request extends ZodUtils.createCamelCaseDto(
  eventPaginateV1Schema
) { }