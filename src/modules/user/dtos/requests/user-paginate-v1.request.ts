import { RoleEnum } from './../../../../shared/enums/role.enum';
import { z } from 'zod';
import { PaginateSchema } from '../../../../shared/dtos/requests/paginate.request';
import { ZodUtils } from '../../../../shared/utils/zod.util';

export const UserPaginateV1Schema = PaginateSchema.extend({
    email: z.boolean().optional(),
    role:z.enum(RoleEnum)
});

export class UserPaginateV1Request extends ZodUtils.createCamelCaseDto(
    UserPaginateV1Schema,
) { }
