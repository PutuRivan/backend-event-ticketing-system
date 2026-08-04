import { IEventCategories } from '../../../infrastructures/databases/interfaces/event-categories.interface';
import { EventCategoriesPaginateV1Request } from '../dtos/requests/event-categories-paginate-v1.request';
import { EventCategoriesV1Repository } from './../repositories/event-categories-v1.repository';
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { EventCategoriesCreateV1Request } from '../dtos/requests/event-categories-create-v1.request';
import { eventCategoriesUpdateV1Request } from '../dtos/requests/event-categories-update-v1.request';
import { ErrorMessageConstant } from '../../../shared/constants/message.constant';

@Injectable()
export class EventCategoriesV1Service {
  constructor(
    private readonly eventCategoriesV1Repository: EventCategoriesV1Repository,
  ) { }

  async paginate(paginationDto: EventCategoriesPaginateV1Request) {
    return await this.eventCategoriesV1Repository.paginate(paginationDto)
  }

  async findOneById(id: string): Promise<IEventCategories> {
    const category = await this.eventCategoriesV1Repository.findOneById(id);
    if (!category) {
      throw new NotFoundException(
        ErrorMessageConstant.DataEntityNotFound('Category'),
      );
    }
    return category;
  }

  async createCategory(data: EventCategoriesCreateV1Request): Promise<IEventCategories> {
    const category = this.eventCategoriesV1Repository.createEventCategory(data);

    return category;
  }

  async updateById(
    id: string,
    dataUpdate: eventCategoriesUpdateV1Request,
  ): Promise<IEventCategories> {
    const eventCategory = await this.eventCategoriesV1Repository.findOneById(id);

    if (!eventCategory) {
      throw new NotFoundException('Category Not Found');
    }

    const payload = Object.fromEntries(
      Object.entries({
        name: dataUpdate.name,
        description: dataUpdate.description,
      }).filter(([, v]) => v !== undefined),
    );

    const isUpdate = await this.eventCategoriesV1Repository.updateEventCategory(id, payload)

    if (!isUpdate) {
      throw new BadRequestException(ErrorMessageConstant.BadRequest)
    }

    return await this.findOneById(id)
  }

  async softDeleteById(id: string): Promise<Boolean> {
    await this.findOneById(id);
    await this.eventCategoriesV1Repository.softDelete({ id })
    return true
  }
}