import { z } from "zod";
import { ErrorMessageConstant } from "../../../../shared/constants/message.constant";
import { ZodUtils } from "../../../../shared/utils/zod.util";

export const EventCategoriesCreateV1Schema = z.object({
  name: z.string().min(1, {
    message: ErrorMessageConstant.FieldRequiredWithName('Name')
  }),
  description: z.string().min(1, {
    message: ErrorMessageConstant.FieldRequiredWithName('Desription')
  })
})

export class EventCategoriesCreateV1Request extends ZodUtils.createCamelCaseDto(
  EventCategoriesCreateV1Schema,
) { }