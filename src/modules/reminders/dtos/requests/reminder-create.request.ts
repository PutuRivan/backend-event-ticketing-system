import { z } from "zod";
import { ReminderTypeEnum } from "../../../../shared/enums/reminder-type.enum";
import { ZodUtils } from "../../../../shared/utils/zod.util";
import { ErrorMessageConstant } from "../../../../shared/constants/message.constant";


export const reminderCreateV1Schema = z.object({
  orderId: z
    .string({
      error:
        ErrorMessageConstant.FieldRequiredWithName(
          "orderId"
        ),
    })
    .uuid(
      ErrorMessageConstant.FieldInvalidValueWithName(
        "orderId",
        "UUID"
      )
    ),
    type: z
    .nativeEnum(ReminderTypeEnum, {
      error:
        ErrorMessageConstant.FieldInvalidValueWithName(
          "type",
          "valid reminder type"
        ),
    }),
  scheduledAt: z
    .coerce
    .date({
      error:
        ErrorMessageConstant.FieldInvalidValueWithName(
          "scheduledAt",
          "date"
        ),
    }),

});


export class ReminderCreateV1Request extends ZodUtils.createCamelCaseDto(
  reminderCreateV1Schema
) { }