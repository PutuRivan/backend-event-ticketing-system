import { Module } from "@nestjs/common";
import { ReminderCronService } from "./services/reminder-cron.service";
import { RemindersModule } from "../../../modules/reminders/reminders.module";
import { QueueModule } from "../queue/queue.module";


@Module({
  imports: [
    RemindersModule,
    QueueModule
  ],

  providers: [
    ReminderCronService
  ],

  exports: [
    ReminderCronService
  ]
})
export class CronModule { }