import { z } from 'zod';
import { PaginateSchema } from '../../../../shared/dtos/requests/paginate.request';
import { ZodUtils } from '../../../../shared/utils/zod.util';

export const UserPaginateV1Schema = PaginateSchema.extend({
    emailVerfied: z.boolean().optional(),
    phoneNumberVerified: z.boolean().optional(),
});

export class UserPaginateV1Request extends ZodUtils.createCamelCaseDto(
    UserPaginateV1Schema,
) { }
