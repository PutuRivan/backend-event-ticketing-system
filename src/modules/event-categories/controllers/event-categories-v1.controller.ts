import { EventCategoriesCreateV1Request } from './../dtos/requests/event-categories-create-v1.request';
import { IPaginationData } from '../../../shared/interfaces/paginate-response.interface';
import { EventCategoriesPaginateV1Request } from '../dtos/requests/event-categories-paginate-v1.request';
import { eventCategoriesUpdateV1Request } from '../dtos/requests/event-categories-update-v1.request';
import { EventCategoriesV1Response } from '../dtos/responses/event-categories-v1.response';
import { EventCategoriesV1Service } from './../services/event-categories-v1.service';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthTypeEnum } from '../../../infrastructures/modules/jwt/enums/jwt-type.enum';
import { Public } from '../../../shared/decorators/public.decorator';
import { Roles } from '../../../shared/decorators/role.decorator';
import { RoleEnum } from '../../../shared/enums/role.enum';
import { CachePrefix } from '../../../infrastructures/modules/cache/decorators/cache-prefix.decorator';
import { Cacheable } from '../../../infrastructures/modules/cache/decorators/cacheable.decorator';
import { DateTimeUtil } from '../../../shared/utils/datetime.util';
import { InvalidateCache } from '../../../infrastructures/modules/cache/decorators/invalidate-cache.decorator';

@ApiTags('Event Categories')
@Controller({ path: "event-categories", version: "1" })
@CachePrefix("event-categories")
export class EventCategoriesV1Controller {
  constructor(
    private readonly eventCategoriesV1Service: EventCategoriesV1Service
  ) { }

  // ================================================
  //                    PUBLIC
  //=================================================
  @Public()
  @ApiOperation({ summary: 'Get all event categories' })
  @ApiResponse({ status: 200 })
  @Get('')
  @Cacheable(DateTimeUtil.hours(1))
  async getAllEventCategories(
    @Query() paginationDto: EventCategoriesPaginateV1Request
  ): Promise<IPaginationData<EventCategoriesV1Response>> {
    const result = await this.eventCategoriesV1Service.paginate(paginationDto)

    return {
      meta: result.meta,
      items: EventCategoriesV1Response.MapEntities(result.items)
    }
  }

  @Public()
  @ApiOperation({ summary: 'Get event category by ID' })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiResponse({ status: 200 })
  @Get(':categoryId')
  @Cacheable(DateTimeUtil.hours(1))
  async getEventCategoriesById(
    @Param('categoryId') categoryId: string
  ): Promise<EventCategoriesV1Response> {
    const data = await this.eventCategoriesV1Service.findOneById(categoryId)

    return EventCategoriesV1Response.MapEntity(data)
  }

  // ================================================
  //                    ADMIN
  //=================================================
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth(JwtAuthTypeEnum.AccessToken)
  @ApiOperation({ summary: 'Create a new event category' })
  @ApiResponse({ status: 201 })
  @Post('')
  @InvalidateCache()
  async createEventCategories(
    @Body() dataCategory: EventCategoriesCreateV1Request
  ): Promise<EventCategoriesV1Response> {
    const result = await this.eventCategoriesV1Service.createCategory(dataCategory)

    return EventCategoriesV1Response.MapEntity(result)
  }

  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth(JwtAuthTypeEnum.AccessToken)
  @ApiOperation({ summary: 'Update event category by ID' })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiResponse({ status: 200 })
  @Patch(':categoryId')
  @InvalidateCache()
  async updateEventCategoriesById(
    @Param('categoryId') categoryId: string,
    @Body() dataCategory: eventCategoriesUpdateV1Request
  ): Promise<EventCategoriesV1Response> {
    const data = await this.eventCategoriesV1Service.updateById(categoryId, dataCategory)

    return EventCategoriesV1Response.MapEntity(data)
  }

  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth(JwtAuthTypeEnum.AccessToken)
  @ApiOperation({ summary: 'Delete event category by ID' })
  @ApiParam({ name: 'categoryId', description: 'Category ID' })
  @ApiResponse({ status: 204, description: 'Category deleted successfully' })
  @Delete(':categoryId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @InvalidateCache()
  async deleteEventCategoriesById(
    @Param('categoryId') categoryId: string
  ): Promise<EventCategoriesV1Response | null> {
    await this.eventCategoriesV1Service.softDeleteById(categoryId)

    return null
  }
}
