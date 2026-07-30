export enum ReminderType {
  SevenDays = "7_days",
  OneDay = "1_day",
  OneHour = "1_hour",
  Testing = "testing",
}


const DAY =
  24 * 60 * 60 * 1000;

const HOUR =
  60 * 60 * 1000;


const IS_REMINDER_TESTING = true;
const TEST_DELAY = 10 * 1000; // 10 detik


export function getReminderSchedules(
  eventDate: Date,
) {

  if (IS_REMINDER_TESTING) {
    return [
      {
        type: ReminderType.Testing,
        delay: TEST_DELAY,
      },
    ];
  }


  const schedules = [
    {
      type: ReminderType.SevenDays,
      delay: calculateDelay(
        eventDate,
        7 * DAY,
      ),
    },
    {
      type: ReminderType.OneDay,
      delay: calculateDelay(
        eventDate,
        DAY,
      ),
    },
    {
      type: ReminderType.OneHour,
      delay: calculateDelay(
        eventDate,
        HOUR,
      ),
    },
  ];


  return schedules.filter(
    (item) => item.delay > 0
  );

}


function calculateDelay(
  eventDate: Date,
  beforeMs: number,
): number {

  return (
    new Date(eventDate).getTime()
    -
    Date.now()
    -
    beforeMs
  );

}