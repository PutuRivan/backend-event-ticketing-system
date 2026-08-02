import { Controller, Get, Query } from "@nestjs/common";
import { DashboardV1Service } from "../services/dashboard-v1.service";
import { Roles } from "../../../shared/decorators/role.decorator";
import { RoleEnum } from "../../../shared/enums/role.enum";

import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { JwtAuthTypeEnum } from '../../../infrastructures/modules/jwt/enums/jwt-type.enum';

@ApiTags('Dashboard')
@ApiBearerAuth(JwtAuthTypeEnum.AccessToken)
@Controller({ path: "dashboard", version: "1" })
export class DashboardV1Controller {

  constructor(
    private readonly dashboardService: DashboardV1Service
  ) { }

  @Roles(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Get dashboard summary' })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200 })
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
  @ApiOperation({ summary: 'Get top events' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200 })
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
  @ApiOperation({ summary: 'Get top categories' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'startDate', required: false, type: String })
  @ApiQuery({ name: 'endDate', required: false, type: String })
  @ApiResponse({ status: 200 })
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