import { Controller, Get, Query } from "@nestjs/common";
import { ApiExcludeController } from "@nestjs/swagger";
import { LogActivityV1Service } from "../services/log-activity-v1.service";
import { Permission } from "../../../shared/decorators/permission.decorator";
import { Resource } from "../../../shared/constants/resource.constant";
import { Operation } from "../../../shared/constants/operation.constant";
import { LogActivityPaginateV1Request } from "../dtos/requests/log-activity-paginate-v1.request";
import { IPaginationData } from "../../../shared/interfaces/paginate-response.interface";
import { LogActivityV1Response } from "../dtos/responses/log-activity-v1.response";

@ApiExcludeController()
@Controller({ path: 'log-activities', version: '1' })
export class LogActivityV1Controller {
  constructor(
    private readonly logActivityV1Service: LogActivityV1Service
  ) { }

  @Permission(Resource.LogActivity, [Operation.View])
  @Get()
  async paginate(
    @Query() paginateDto: LogActivityPaginateV1Request
  ): Promise<IPaginationData<LogActivityV1Response>> {
    const result = await this.logActivityV1Service.paginate(paginateDto);

    return {
      meta: result.meta,
      items: LogActivityV1Response.MapEntities(result.items),
    };
  }
}
