import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EventCategories } from "../../infrastructures/databases/entities/event-categories.entity";
import { EventCategoriesV1Controller } from "./controllers/event-categories-v1.controller";
import { EventCategoriesV1Service } from "./services/event-categories-v1.service";
import { EventCategoriesV1Repository } from "./repositories/event-categories-v1.repository";
import { CacheService } from "../../infrastructures/modules/cache/services/cache.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([EventCategories])
  ],
  controllers: [EventCategoriesV1Controller],
  providers: [
    EventCategoriesV1Service,
    EventCategoriesV1Repository,
    CacheService
  ],
  exports: [
    EventCategoriesV1Service,
    EventCategoriesV1Repository
  ],
})

export class EventCategoriesModule { }