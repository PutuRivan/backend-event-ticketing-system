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
    .positive({
      message: ErrorMessageConstant.FieldMustBePositive(
        'Quantity',
      ),
    }),
});

export class ordersCreateV1Request extends ZodUtils.createCamelCaseDto(
  ordersCreateV1Schema
) { }