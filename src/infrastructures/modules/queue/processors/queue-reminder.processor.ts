import { Processor, WorkerHost } from "@nestjs/bullmq";
import { QueueMailJob, QueueName, QueueReminderJob } from "../constants/queue.constant";
import { OrdersV1Service } from "../../../../modules/orders/services/orders-v1.service";
import { QueueMailService } from "../services/queue-mail.service";
import { Job } from "bullmq";
import { OrderStatusEnum } from "../../../../shared/enums/order-status.enum";
import { MailTemplateFileEnum } from "../../mail/enums/mail-template-file.enum";



@Processor(QueueName.Reminder)
export class QueueReminderProcessor extends WorkerHost {

  constructor(
    private readonly orderService: OrdersV1Service,
    private readonly queueMailService: QueueMailService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {

    const jobName = job.name;

    switch (jobName) {
      case QueueReminderJob.SendReminder:

        const order =
          await this.orderService.findOneById(
            job.data.orderId,
          );


        if (!order)
          return;

        if (order.status !== OrderStatusEnum.PAID)
          return;

        await this.queueMailService.sendToQueue(
          {
            to: order.user.email,
            subject: "Reminder Event",
            template:
              MailTemplateFileEnum.EventReminder,
            context: {
              name: order.user.name,
              eventName: order.event.title,
              eventDate: order.event.eventDate,
              location: order.event.location,
              reminderType:
                job.data.reminderType,
            },
          },
          QueueMailJob.MailSend,
        );

        break;
    }

  }

}