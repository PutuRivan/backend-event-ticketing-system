import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Reminders } from "../../infrastructures/databases/entities/reminder.entity";
import { RemindersV1Repository } from "./repositories/reminders-v1.repository";
import { RemindersV1Service } from "./services/reminders-v1.service";


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reminders
    ]),
  ],

  providers: [
    RemindersV1Repository,
    RemindersV1Service,
  ],

  exports: [
    RemindersV1Service,
  ],
})
export class RemindersModule {}