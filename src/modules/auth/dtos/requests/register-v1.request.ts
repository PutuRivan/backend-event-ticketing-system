import { z } from "zod";
import { ZodUtils } from "../../../../shared/utils/zod.util";
import { ErrorMessageConstant } from "../../../../shared/constants/message.constant";
import { Regex } from "../../../../shared/constants/regex.constant";

const RegisterV1Schema = z.object({
  name: z.string().min(1, {
    message: ErrorMessageConstant.FieldRequiredWithName('name'),
  }),
  email: z
    .string()
    .email({ message: ErrorMessageConstant.InvalidEmailFormat }),
  password: z
    .string()
    .min(8, { message: ErrorMessageConstant.PasswordTooShort(8) })
    .regex(Regex.Password, {
      message: ErrorMessageConstant.PasswordTooWeak,
    }),
})

export class RegisterV1Request extends ZodUtils.createCamelCaseDto(
  RegisterV1Schema
) { }