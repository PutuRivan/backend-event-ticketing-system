import { EventCategoriesV1Repository } from './../../event-categories/repositories/event-categories-v1.repository';
import { EventPaginateV1Request } from '../dtos/requests/event-v1-paginate.request';
import { EventV1Repository } from './../repositories/events-v1.repository';
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { eventCreateV1Request } from '../dtos/requests/event-v1-create.request';
import { IEvent } from '../../../infrastructures/databases/interfaces/event.interface';
import { EventUpdateV1Request } from '../dtos/requests/event-v1-update.request';
import { ErrorMessageConstant } from '../../../shared/constants/message.constant';

@Injectable()
export class EventV1Service {
  constructor(
    private readonly EventV1Repository: EventV1Repository,
    private readonly EventCategoriesV1Repository: EventCategoriesV1Repository
  ) { }

  async paginate(paginationDto: EventPaginateV1Request) {
    return await this.EventV1Repository.paginate(paginationDto)
  }

  async findOneById(id: string): Promise<IEvent> {
    const event = await this.EventV1Repository.findOneById(id)

    if (!event) {
      throw new NotFoundException(ErrorMessageConstant.DataEntityNotFound('Event'))
    }

    return event
  }

  async createEvent(
    dataEvent: eventCreateV1Request
  ): Promise<IEvent> {
    // Cek Event Category
    const eventCategory = await this.EventCategoriesV1Repository.findOneById(dataEvent.categoryId)

    if (!eventCategory) {
      throw new NotFoundException(ErrorMessageConstant.DataEntityNotFound('Category'));
    }

    return await this.EventV1Repository.createEvent(dataEvent)
  }

  async updateById(
    id: string,
    dataUpdate: EventUpdateV1Request
  ): Promise<IEvent> {
    // Cek Event
    const event = await this.EventV1Repository.findOneById(id)

    if (!event) {
      throw new NotFoundException('Event Not Found')
    }

    const payload = Object.fromEntries(
      Object.entries({
        title: dataUpdate.title,
        description: dataUpdate.description,
        location: dataUpdate.location,
        eventDate: dataUpdate.eventDate,
        ticketPrice: dataUpdate.ticketPrice,
        quota: dataUpdate.quota
      }).filter(([, v]) => v !== undefined),
    );

    const isUpdate = await this.EventV1Repository.updateEvent(id, payload)

    if (!isUpdate) {
      throw new BadRequestException(ErrorMessageConstant.BadRequest)
    }

    return await this.findOneById(id)
  }

  async softDeleteById(id: string): Promise<Boolean> {
    await this.findOneById(id);
    await this.EventV1Repository.softDelete({ id })
    return true
  }

  async updatePublishedStatus(id: string, published: boolean): Promise<IEvent> {
    // Cek Event
    const event = await this.EventV1Repository.findOneById(id)

    if (!event) {
      throw new NotFoundException('Event Not Found')
    }

    const payload = Object.fromEntries(
      Object.entries({
        published: published
      }).filter(([, v]) => v !== undefined),
    );

    const isUpdate = await this.EventV1Repository.updateEvent(id, payload)

    if (!isUpdate) {
      throw new BadRequestException(ErrorMessageConstant.BadRequest)
    }

    return await this.findOneById(id)
  }
}