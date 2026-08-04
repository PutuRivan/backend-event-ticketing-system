import { Injectable } from "@nestjs/common";
import { RemindersV1Service } from "../../../../modules/reminders/services/reminders-v1.service";
import { CronExpressionConstant } from "../constants/cron.constant";
import { Cron } from "@nestjs/schedule";
import { QueueMailService } from "../../queue/services/queue-mail.service";
import { MailSendDto } from "../../mail/dto/mail-send.dto";
import { MailTemplateFileEnum } from "../../mail/enums/mail-template-file.enum";
import { QueueMailJob, QueueName } from "../../queue/constants/queue.constant";
import { IQueueService } from "../../queue/interfaces/queue-service.interface";
import { QueueFactoryService } from "../../queue/services/queue-factory.service";

@Injectable()
export class ReminderCronService {
  private queueMailService: IQueueService
  constructor(
    private readonly remindersService: RemindersV1Service,
    private readonly queueFactoryService: QueueFactoryService,
  ) {

    this.queueMailService = this.queueFactoryService.createQueueService(
      QueueName.Mail
    )
  }


  @Cron(
    CronExpressionConstant.EverySecond
  )
  async handleReminder() {
    const reminders =
      await this.remindersService.getPendingReminders();


    if (!reminders.length) {
      return;
    }


    for (const reminder of reminders) {


      const order =
        reminder.order;


      await this.queueMailService.sendToQueue<MailSendDto>(
        {
          to:
            order.user.email,
          subject:
            'Event Reminder',
          template: MailTemplateFileEnum.EventReminder,
          context: {
            name: order.user.name,
            eventName: order.event.title,
            eventDate: order.event.eventDate,
            location: order.event.location,
            reminderType: reminder.type,
          },
        },
        QueueMailJob.MailSend
      );
      await this.remindersService.markAsSent(
        reminder.id
      );

    }

  }

}