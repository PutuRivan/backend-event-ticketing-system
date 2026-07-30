import { Inject, Injectable } from "@nestjs/common";
import type { IDashboardV1Repository } from "../interfaces/dashboard-repository.interface";
import { DASHBOARD_V1_REPOSITORY } from "../constants/dashboard-v1.constant";

@Injectable()
export class DashboardV1Service {
  constructor(
    @Inject(DASHBOARD_V1_REPOSITORY)
    private readonly dashboardV1Repository: IDashboardV1Repository
  ) { }


  async getSummary(
    startDate?: Date,
    endDate?: Date
  ) {

    return this.dashboardV1Repository.getSummary(
      startDate,
      endDate
    );

  }

  async getTopEvents(
    limit: number = 5,
    startDate?: Date,
    endDate?: Date
  ) {

    return this.dashboardV1Repository.getTopEvents(
      limit,
      startDate,
      endDate
    );
  }

  async getTopCategories(
    limit: number = 5,
    startDate?: Date,
    endDate?: Date
  ) {

    return this.dashboardV1Repository.getTopCategories(
      limit,
      startDate,
      endDate
    );
  }
}