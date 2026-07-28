import { PaginateSchema } from "../../../../shared/dtos/requests/paginate.request";
import { ZodUtils } from "../../../../shared/utils/zod.util";

export const LogActivityPaginateV1Schema = PaginateSchema.extend({});

export class LogActivityPaginateV1Request extends ZodUtils.createCamelCaseDto(
    LogActivityPaginateV1Schema,
) { }
