import { z } from "zod";
import { PaginateSchema } from "../../../../shared/dtos/requests/paginate.request";
import { ZodUtils } from "../../../../shared/utils/zod.util";

export const eventPaginateV1Schema = PaginateSchema.extend({
  name: z.string().optional(),
  publish: z.boolean()
})

export class EventPaginateV1Request extends ZodUtils.createCamelCaseDto(
  eventPaginateV1Schema
) { }