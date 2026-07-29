import { PaginateSchema } from "../../../../shared/dtos/requests/paginate.request";
import { ZodUtils } from "../../../../shared/utils/zod.util";

export const TicketPaginateV1Schema = PaginateSchema.extend({})

export class TicketPaginateV1Request extends ZodUtils.createCamelCaseDto(
  TicketPaginateV1Schema
) { }