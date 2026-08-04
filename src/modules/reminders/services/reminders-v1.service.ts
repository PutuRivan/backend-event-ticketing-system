import { Injectable } from "@nestjs/common";
import { Orders } from "../../../infrastructures/databases/entities/orders.entity";
import { ReminderTypeEnum } from "../../../shared/enums/reminder-type.enum";
import { RemindersV1Repository } from "../repositories/reminders-v1.repository";
import { IOrder } from "../../../infrastructures/databases/interfaces/order.interface";
import { generateReminderSchedules } from "../helpers/reminder.helper";


@Injectable()
export class RemindersV1Service {

  constructor(
    private readonly remindersV1Repository:
      RemindersV1Repository,
  ) { }



  async createReminders(
    order: IOrder
  ) {

    const eventDate =
      order.event.eventDate;


    const reminders =
      generateReminderSchedules({
        orderId: order.id,
        eventDate: order.event.eventDate
      });


    return this.remindersV1Repository.createMany(
      reminders
    );

  }



  async getPendingReminders() {

    return this.remindersV1Repository.findPending();

  }



  async markAsSent(
    id: string
  ) {

    return this.remindersV1Repository.markAsSent(
      id
    );

  }



  private subtractTime(
    date: Date,
    milliseconds: number,
  ) {

    return new Date(
      date.getTime() - milliseconds
    );

  }

}