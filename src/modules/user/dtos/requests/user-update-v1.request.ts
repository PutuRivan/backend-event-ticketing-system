import { z } from 'zod';
import { ZodUtils } from '../../../../shared/utils/zod.util';
import { ErrorMessageConstant } from '../../../../shared/constants/message.constant';

export const UserUpdateV1Schema = z.object({
    name: z.string().min(1, {
        message: ErrorMessageConstant.FieldRequiredWithName('Fullname'),
    }),
    email: z
        .string()
        .email({ message: ErrorMessageConstant.InvalidEmailFormat }),
});

export class UserUpdateV1Request extends ZodUtils.createCamelCaseDto(
    UserUpdateV1Schema,
) { }
