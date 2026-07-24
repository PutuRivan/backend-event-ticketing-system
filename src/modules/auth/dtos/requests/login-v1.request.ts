import { z } from "zod";
import { ZodUtils } from "../../../../shared/utils/zod.util";

const LoginV1Schema = z.object({
  email: z.string(),
  password: z.string()
})

export class LoginV1Request extends ZodUtils.createCamelCaseDto(
  LoginV1Schema
) { }