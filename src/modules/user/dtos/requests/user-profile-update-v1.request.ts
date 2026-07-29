import { z } from "zod";
import { ZodUtils } from "../../../../shared/utils/zod.util";

export const UserProfileUpdateV1Schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
})

export class UserProfileUpdateV1Request extends ZodUtils.createCamelCaseDto(
  UserProfileUpdateV1Schema
) { }