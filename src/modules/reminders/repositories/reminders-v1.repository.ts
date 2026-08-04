import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Reminders } from "../../../infrastructures/databases/entities/reminder.entity";
import { IReminders } from "../../../infrastructures/databases/interfaces/reminders.interface";

@Injectable()
export class RemindersV1Repository extends Repository<IReminders> {

  constructor(
    @InjectRepository(Reminders)
    private readonly repo: Repository<IReminders>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }


  async createMany(
    data: Partial<IReminders>[],
  ): Promise<IReminders[]> {

    const entities =
      this.create(data);

    return this.save(entities);
  }



  async findPending(): Promise<IReminders[]> {

    return this
      .createQueryBuilder('reminder')
      .leftJoinAndSelect(
        'reminder.order',
        'order'
      )
      .leftJoinAndSelect(
        'order.user',
        'user'
      )
      .leftJoinAndSelect(
        'order.event',
        'event'
      )
      .where(
        'reminder.sent_at IS NULL'
      )
      .andWhere(
        'reminder.scheduled_at <= NOW()'
      )
      .getMany();

  }



  async markAsSent(
    id: string
  ): Promise<void> {

    await this
      .createQueryBuilder()
      .update(Reminders)
      .set({
        sentAt: new Date()
      })
      .where(
        'id = :id',
        { id }
      )
      .andWhere(
        'sent_at IS NULL'
      )
      .execute();

  }

}