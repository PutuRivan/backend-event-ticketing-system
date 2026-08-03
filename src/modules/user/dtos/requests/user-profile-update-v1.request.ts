import { z } from "zod";
import { ZodUtils } from "../../../../shared/utils/zod.util";

export const UserProfileUpdateV1Schema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
})

export class UserProfileUpdateV1Request extends ZodUtils.createCamelCaseDto(
  UserProfileUpdateV1Schema
) { }