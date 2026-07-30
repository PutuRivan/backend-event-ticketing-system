import { Module } from "@nestjs/common";
import { DashboardV1Controller } from "./controllers/dashboard-v1.controller";
import { DashboardV1Service } from "./services/dashboard-v1.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Orders } from "../../infrastructures/databases/entities/orders.entity";
import { DashboardV1Repository } from "./repositories/dashboard-v1.repository";
import { DASHBOARD_V1_REPOSITORY } from "./constants/dashboard-v1.constant";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Orders,
    ]),
  ],
  controllers: [DashboardV1Controller],
  providers: [
    DashboardV1Service,
    {
      provide: DASHBOARD_V1_REPOSITORY,
      useClass: DashboardV1Repository
    },
    DashboardV1Repository
  ],
  exports: [
    DashboardV1Service,
    DashboardV1Service
  ],
})

export class DashboardModule { }