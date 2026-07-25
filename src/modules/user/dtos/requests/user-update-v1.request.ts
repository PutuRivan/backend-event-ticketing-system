import { z } from 'zod';
import { ZodUtils } from '../../../../shared/utils/zod.util';
import { ErrorMessageConstant } from '../../../../shared/constants/message.constant';
import { RoleEnum } from '../../../../shared/enums/role.enum';

export const UserUpdateV1Schema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
    role: z.enum(RoleEnum),
});

export class UserUpdateV1Request extends ZodUtils.createCamelCaseDto(
    UserUpdateV1Schema,
) { }
