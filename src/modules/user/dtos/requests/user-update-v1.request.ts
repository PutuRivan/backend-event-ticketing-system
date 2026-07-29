import { z } from 'zod';
import { ZodUtils } from '../../../../shared/utils/zod.util';
import { RoleEnum } from '../../../../shared/enums/role.enum';
import { UserProfileUpdateV1Schema } from './user-profile-update-v1.request';

export const UserUpdateV1Schema = UserProfileUpdateV1Schema.extend({
    role: z.enum(RoleEnum),
})

export class UserUpdateV1Request extends ZodUtils.createCamelCaseDto(
    UserUpdateV1Schema,
) { }
