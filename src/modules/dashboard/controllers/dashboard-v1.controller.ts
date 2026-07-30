import { Controller, Get, Query } from "@nestjs/common";
import { DashboardV1Service } from "../services/dashboard-v1.service";
import { Roles } from "../../../shared/decorators/role.decorator";
import { RoleEnum } from "../../../shared/enums/role.enum";

@Controller({ path: "dashboard", version: "1" })
export class DashboardV1Controller {

  constructor(
    private readonly dashboardService: DashboardV1Service
  ) { }

  @Roles(RoleEnum.ADMIN)
  @Get("summary")
  async summary(
    @Query("startDate")
    startDate?: string,

    @Query("endDate")
    endDate?: string
  ) {

    return this.dashboardService.getSummary(
      startDate
        ? new Date(startDate)
        : undefined,

      endDate
        ? new Date(endDate)
        : undefined
    );
  }

  @Roles(RoleEnum.ADMIN)
  @Get("top-events")
  async topEvents(
    @Query("limit")
    limit?: number,

    @Query("startDate")
    startDate?: string,

    @Query("endDate")
    endDate?: string
  ) {

    return this.dashboardService.getTopEvents(
      limit ? Number(limit) : 5,

      startDate
        ? new Date(startDate)
        : undefined,

      endDate
        ? new Date(endDate)
        : undefined
    );

  }

  @Roles(RoleEnum.ADMIN)
  @Get("top-categories")
  async topCategories(
    @Query("limit")
    limit?: number,

    @Query("startDate")
    startDate?: string,

    @Query("endDate")
    endDate?: string
  ) {
    return this.dashboardService.getTopCategories(
      limit ? Number(limit) : 5,

      startDate
        ? new Date(startDate)
        : undefined,

      endDate
        ? new Date(endDate)
        : undefined
    );
  }
}