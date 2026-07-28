import { ApiTags } from '@nestjs/swagger';
import { IPaginateData } from '../../../shared/interfaces/paginate-response.interface';
import { eventCreateV1Request } from '../dtos/requests/event-v1-create.request';
import { EventPaginateV1Request } from '../dtos/requests/event-v1-paginate.request';
import { EventUpdateV1Request } from '../dtos/requests/event-v1-update.request';
import { EventV1Response } from '../dtos/responses/event-v1.response';
import { EventV1Service } from './../services/events-v1.service';
import { Controller, Get, Post, Patch, Delete, Query, Body, Param } from "@nestjs/common";
import { Public } from '../../../shared/decorators/public.decorator';
import { Roles } from '../../../shared/decorators/role.decorator';
import { RoleEnum } from '../../../shared/enums/role.enum';

@ApiTags('Event')
@Controller({ path: "events", version: "1" })
export class EventsV1Controller {
  constructor(
    private readonly eventV1Service: EventV1Service
  ) { }

  // ================================================
  //                    PUBLIC
  //=================================================
  @Public()
  @Get('')
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
  @Get(':eventId')
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
  @Post('')
  async createEvent(
    @Body() dataEvent: eventCreateV1Request
  ): Promise<EventV1Response> {
    const result = await this.eventV1Service.createEvent(dataEvent)

    return EventV1Response.MapEntity(result)
  }

  @Roles(RoleEnum.ADMIN)
  @Patch(':eventId')
  async updateEventById(
    @Param('eventId') eventId: string,
    @Body() updateData: EventUpdateV1Request
  ): Promise<EventV1Response> {
    const data = await this.eventV1Service.updateById(eventId, updateData)

    return EventV1Response.MapEntity(data)
  }

  @Roles(RoleEnum.ADMIN)
  @Delete(':eventId')
  async deleteEventById(
    @Param('eventId') eventId: string
  ): Promise<EventV1Response | null> {
    await this.eventV1Service.softDeleteById(eventId)

    return null
  }

  @Roles(RoleEnum.ADMIN)
  @Patch(':eventId/publish')
  async updateEventToPublish(
    @Param('eventId') eventId: string
  ): Promise<EventV1Response> {
    const data = await this.eventV1Service.updatePublishedStatus(eventId, true)

    return EventV1Response.MapEntity(data)
  }

  @Roles(RoleEnum.ADMIN)
  @Patch(':eventId/unpublish')
  async updateEventToUnpublish(
    @Param('eventId') eventId: string
  ): Promise<EventV1Response> {
    const data = await this.eventV1Service.updatePublishedStatus(eventId, false)

    return EventV1Response.MapEntity(data)
  }
}