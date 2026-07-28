import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LogActivity } from "../../infrastructures/databases/entities/log-activity.entity";
import { LogActivityV1Controller } from "./controllers/log-activity-v1.controller";
import { LogActivityV1Service } from "./services/log-activity-v1.service";
import { LogActivityV1Repository } from "./repositories/log-activity-v1.repository";

@Module({
  imports: [TypeOrmModule.forFeature([LogActivity])],
  controllers: [LogActivityV1Controller],
  providers: [LogActivityV1Service, LogActivityV1Repository],
  exports: [LogActivityV1Service, LogActivityV1Repository],
})
export class LogActivityModule {}