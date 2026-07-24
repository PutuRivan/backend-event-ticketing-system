import { z } from "zod";
import { ZodUtils } from "../../../../shared/utils/zod.util";

const RegisterV1Schema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string()
})

export class RegisterV1Request extends ZodUtils.createCamelCaseDto(
  RegisterV1Schema
) { }