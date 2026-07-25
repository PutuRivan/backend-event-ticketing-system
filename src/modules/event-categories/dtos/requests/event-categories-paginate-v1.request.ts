import { optional, z } from "zod";
import { PaginateSchema } from "../../../../shared/dtos/requests/paginate.request";
import { ZodUtils } from "../../../../shared/utils/zod.util";

export const eventCategoriesPaginateV1Schema = PaginateSchema.extend({
  name: z.string().optional()
})

export class EventCategoriesPaginateV1Request extends ZodUtils.createCamelCaseDto(
  eventCategoriesPaginateV1Schema
) { }