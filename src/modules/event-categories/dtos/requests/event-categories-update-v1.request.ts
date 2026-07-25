import { z } from "zod";
import { ErrorMessageConstant } from "../../../../shared/constants/message.constant";
import { ZodUtils } from "../../../../shared/utils/zod.util";

export const eventCategoriesV1Schema = z.object({
  name: z.string().optional(),
  description: z.string().optional()
})

export class eventCategoriesUpdateV1Request extends ZodUtils.createCamelCaseDto(
  eventCategoriesV1Schema
) { }