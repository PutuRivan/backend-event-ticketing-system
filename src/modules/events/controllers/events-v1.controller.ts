import { ApiTags, ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { JwtAuthTypeEnum } from '../../../infrastructures/modules/jwt/enums/jwt-type.enum';
import { IPaginateData } from '../../../shared/interfaces/paginate-response.interface';
import { eventCreateV1Request } from '../dtos/requests/event-v1-create.request';
import { EventPaginateV1Request } from '../dtos/requests/event-v1-paginate.request';
import { EventUpdateV1Request } from '../dtos/requests/event-v1-update.request';
import { EventV1Response } from '../dtos/responses/event-v1.response';
import { EventV1Service } from './../services/events-v1.service';
import { Controller, Get, Post, Patch, Delete, Query, Body, Param, HttpCode, HttpStatus } from "@nestjs/common";
import { Public } from '../../../shared/decorators/public.decorator';
import { Roles } from '../../../shared/decorators/role.decorator';
import { RoleEnum } from '../../../shared/enums/role.enum';
import { CachePrefix } from '../../../infrastructures/modules/cache/decorators/cache-prefix.decorator';
import { InvalidateCache } from '../../../infrastructures/modules/cache/decorators/invalidate-cache.decorator';
import { Cacheable } from '../../../infrastructures/modules/cache/decorators/cacheable.decorator';
import { DateTimeUtil } from '../../../shared/utils/datetime.util';

@ApiTags('Event')
@Controller({ path: "events", version: "1" })
@CachePrefix('Events')
export class EventsV1Controller {
  constructor(
    private readonly eventV1Service: EventV1Service
  ) { }

  // ================================================
  //                    PUBLIC
  //=================================================
  @Public()
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200 })
  @Get('')
  @Cacheable(DateTimeUtil.hours(1))
  async getAllEvent(
    @Query() paginateDto: EventPaginateV1Request
  ): Promise<IPaginateData<EventV1Response>> {
    const result = await this.eventV1Service.paginate(paginateDto)

    return {
      meta: result.meta,
      items: EventV1Response.MapEntities(result.items)
    }
  }

  @Public()
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({ status: 200 })
  @Get(':eventId')
  @Cacheable(DateTimeUtil.hours(1))
  async getEventById(
    @Param('eventId') eventId: string
  ): Promise<EventV1Response> {
    const data = await this.eventV1Service.findOneById(eventId)

    return EventV1Response.MapEntity(data)
  }

  // ================================================
  //                    ADMIN
  //=================================================
  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth(JwtAuthTypeEnum.AccessToken)
  @ApiOperation({ summary: 'Create a new event' })
  @ApiResponse({ status: 201 })
  @Post('')
  @InvalidateCache()
  async createEvent(
    @Body() dataEvent: eventCreateV1Request
  ): Promise<EventV1Response> {
    const result = await this.eventV1Service.createEvent(dataEvent)

    return EventV1Response.MapEntity(result)
  }

  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth(JwtAuthTypeEnum.AccessToken)
  @ApiOperation({ summary: 'Update event by ID' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({ status: 200 })
  @Patch(':eventId')
  @InvalidateCache()
  async updateEventById(
    @Param('eventId') eventId: string,
    @Body() updateData: EventUpdateV1Request
  ): Promise<EventV1Response> {
    const data = await this.eventV1Service.updateById(eventId, updateData)

    return EventV1Response.MapEntity(data)
  }

  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth(JwtAuthTypeEnum.AccessToken)
  @ApiOperation({ summary: 'Delete event by ID' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({ status: 200 })
  @Delete(':eventId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @InvalidateCache()
  async deleteEventById(
    @Param('eventId') eventId: string
  ): Promise<EventV1Response | null> {
    await this.eventV1Service.softDeleteById(eventId)

    return null
  }

  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth(JwtAuthTypeEnum.AccessToken)
  @ApiOperation({ summary: 'Publish event' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({ status: 200 })
  @Patch(':eventId/publish')
  @InvalidateCache()
  async updateEventToPublish(
    @Param('eventId') eventId: string
  ): Promise<EventV1Response> {
    const data = await this.eventV1Service.updatePublishedStatus(eventId, true)

    return EventV1Response.MapEntity(data)
  }

  @Roles(RoleEnum.ADMIN)
  @ApiBearerAuth(JwtAuthTypeEnum.AccessToken)
  @ApiOperation({ summary: 'Unpublish event' })
  @ApiParam({ name: 'eventId', description: 'Event ID' })
  @ApiResponse({ status: 200 })
  @Patch(':eventId/unpublish')
  @InvalidateCache()
  async updateEventToUnpublish(
    @Param('eventId') eventId: string
  ): Promise<EventV1Response> {
    const data = await this.eventV1Service.updatePublishedStatus(eventId, false)

    return EventV1Response.MapEntity(data)
  }
}