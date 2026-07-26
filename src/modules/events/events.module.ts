import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Events } from "../../infrastructures/databases/entities/events.entity";
import { EventsV1Controller } from "./controllers/events-v1.controller";
import { EventV1Service } from "./services/events-v1.service";
import { EventV1Repository } from "./repositories/events-v1.repository";
import { EventCategoriesModule } from "../event-categories/event-categories.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Events]),
    EventCategoriesModule
  ],
  controllers: [EventsV1Controller],
  providers: [
    EventV1Service,
    EventV1Repository,
  ],
  exports: [
    EventV1Service,
    EventV1Repository
  ],
})

export class EventModule { }