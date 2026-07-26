import { IPaginateData } from '../../../shared/interfaces/paginate-response.interface';
import { eventCreateV1Request } from '../dtos/requests/event-v1-create.request';
import { EventPaginateV1Request } from '../dtos/requests/event-v1-paginate.request';
import { EventUpdateV1Request } from '../dtos/requests/event-v1-update.request';
import { EventV1Response } from '../dtos/responses/event-v1.response';
import { EventV1Service } from './../services/events-v1.service';
import { Controller, Get, Post, Patch, Delete, Query, Body, Param } from "@nestjs/common";

@Controller({ path: "events", version: "1" })
export class EventsV1Controller {
  constructor(private readonly EventV1Service: EventV1Service) { }

  @Get('')
  async getAllEvent(
    @Query() paginateDto: EventPaginateV1Request
  ): Promise<IPaginateData<EventV1Response>> {
    const result = await this.EventV1Service.paginate(paginateDto)

    return {
      meta: result.meta,
      items: EventV1Response.MapEntities(result.items)
    }
  }

  @Post('')
  async createEvent(
    @Body() dataEvent: eventCreateV1Request
  ): Promise<EventV1Response> {
    const result = await this.EventV1Service.createEvent(dataEvent)

    return EventV1Response.MapEntity(result)
  }

  @Get(':eventId')
  async getEventById(
    @Param('eventId') eventId: string
  ): Promise<EventV1Response> {
    const data = await this.EventV1Service.findOneById(eventId)

    return EventV1Response.MapEntity(data)
  }

  @Patch(':eventId')
  async updateEventById(
    @Param('eventId') eventId: string,
    @Body() updateData: EventUpdateV1Request
  ): Promise<EventV1Response> {
    const data = await this.EventV1Service.updateById(eventId, updateData)

    return EventV1Response.MapEntity(data)

  }

  @Delete(':eventId')
  async deleteEventById(
    @Param('eventId') eventId: string
  ): Promise<EventV1Response | null> {
    await this.EventV1Service.softDeleteById(eventId)

    return null
  }

  @Patch(':eventId/publish')
  async updateEventToPublish(
    @Param('eventId') eventId: string
  ): Promise<EventV1Response> {
    const data = await this.EventV1Service.updatePublishedStatus(eventId, true)

    return EventV1Response.MapEntity(data)
  }

  @Patch(':eventId/unpublish')
  async updateEventToUnpublish(
    @Param('eventId') eventId: string
  ): Promise<EventV1Response> {
    const data = await this.EventV1Service.updatePublishedStatus(eventId, false)

    return EventV1Response.MapEntity(data)
  }
}