import { ReminderTypeEnum } from "../../../shared/enums/reminder-type.enum";
import { DateTimeUtil } from "../../../shared/utils/datetime.util";


interface GenerateReminderPayload {
  orderId: string;
  eventDate: Date;
}


const ReminderOffset = {
  SevenDays:
    DateTimeUtil.hours(24 * 7),

  OneDay:
    DateTimeUtil.hours(24),

  OneHour:
    DateTimeUtil.hours(1),

  Testing:
    DateTimeUtil.seconds(10),
};


export function generateReminderSchedules(
  payload: GenerateReminderPayload
) {

  const {
    orderId,
    eventDate,
  } = payload;

  return [
    {
      orderId,
      type:
        ReminderTypeEnum.SevenDays,
      scheduledAt:
        DateTimeUtil.subtract(
          eventDate,
          ReminderOffset.SevenDays
        ),
    },
    {
      orderId,

      type:
        ReminderTypeEnum.OneDay,

      scheduledAt:
        DateTimeUtil.subtract(
          eventDate,
          ReminderOffset.OneDay
        ),
    },
    {
      orderId,

      type:
        ReminderTypeEnum.OneHour,

      scheduledAt:
        DateTimeUtil.subtract(
          eventDate,
          ReminderOffset.OneHour
        ),
    },
    {
      orderId,

      type:
        ReminderTypeEnum.Testing,

      scheduledAt:
        DateTimeUtil.addSeconds(
          new Date(),
          10
        ),
    },
  ];

}