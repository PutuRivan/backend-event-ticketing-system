import { QueryFailedError } from 'typeorm';
import { IEventCategories } from '../../../infrastructures/databases/interfaces/event-categories.interface';
import { EventCategoriesPaginateV1Request } from '../dtos/requests/event-categories-paginate-v1.request';
import { EventCategoriesV1Repository } from './../repositories/event-categories-v1.repository';
import { Injectable, NotFoundException } from "@nestjs/common";
import { EventCategoriesCreateV1Request } from '../dtos/requests/event-categories-create-v1.request';
import { eventCategoriesUpdateV1Request } from '../dtos/requests/event-categories-update-v1.request';

@Injectable()
export class EventCategoriesV1Service {
  constructor(
    private readonly eventCategoriesV1Repository: EventCategoriesV1Repository
  ) { }

  async paginate(paginationDto: EventCategoriesPaginateV1Request) {
    return await this.eventCategoriesV1Repository.paginate(paginationDto)
  }

  async findOneById(id: string): Promise<IEventCategories> {
    return await this.eventCategoriesV1Repository.findOneById(id)
  }

  async createCategory(data: EventCategoriesCreateV1Request): Promise<IEventCategories> {
    return await this.eventCategoriesV1Repository.createEventCategory(data);
  }

  async updateById(
    id: string,
    dataUpdate: eventCategoriesUpdateV1Request,
  ): Promise<IEventCategories> {
    const eventCategory = await this.eventCategoriesV1Repository.findOneById(id);

    if (!eventCategory) {
      throw new NotFoundException('Category Not Found');
    }

    Object.assign(eventCategory, {
      ...(dataUpdate.name !== undefined && {
        name: dataUpdate.name,
      }),
      ...(dataUpdate.description !== undefined && {
        description: dataUpdate.description,
      }),
    });

    return await this.eventCategoriesV1Repository.updateEventCategory(
      eventCategory,
    );
  }

  async softDeleteById(id: string): Promise<Boolean> {
    const status = await this.eventCategoriesV1Repository.softDelete({ id })
    if (status.affected && status.affected < 1) {
      throw new QueryFailedError(
        'Error, Data not deleted',
        undefined,
        new Error
      )
    }

    return true
  }
}