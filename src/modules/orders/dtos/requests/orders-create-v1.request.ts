import { z } from "zod";
import { ZodUtils } from "../../../../shared/utils/zod.util";
import { ErrorMessageConstant } from "../../../../shared/constants/message.constant";

export const ordersCreateV1Schema = z.object({
  eventId: z
    .uuid({
      message: ErrorMessageConstant.FieldInvalidFormat(
        'Event ID',
        'UUID',
      ),
    }),

  quantity: z
    .number({
      message: ErrorMessageConstant.FieldInvalidValueWithName(
        'Quantity',
        'number',
      ),
    })
    .int({
      message: ErrorMessageConstant.FieldInvalidValueWithName(
        'Quantity',
        'integer',
      ),
    })
    .min(1, {
      message: ErrorMessageConstant.FieldMinValue(
        'Quantity',
        1,
      ),
    })
    .max(10, {
      message: ErrorMessageConstant.FieldMaxValue(
        'Quantity',
        10,
      ),
    }),
});

export class ordersCreateV1Request extends ZodUtils.createCamelCaseDto(
  ordersCreateV1Schema
) { }