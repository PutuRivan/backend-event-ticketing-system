import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventPaginateV1Request } from '../dtos/requests/event-v1-paginate.request';
import { PaginationUtil } from '../../../shared/utils/pagination.util';
import { Events } from "../../../infrastructures/databases/entities/events.entity";
import { eventCreateV1Request } from "../dtos/requests/event-v1-create.request";
import { IEvent } from "../../../infrastructures/databases/interfaces/event.interface";

@Injectable()
export class EventV1Repository extends Repository<Events> {
  constructor(
    @InjectRepository(Events)
    private readonly repo: Repository<Events>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner)
  }

  async paginate(request: EventPaginateV1Request) {
    const query = this.createQueryBuilder()

    query.take(request.perPage)
    query.skip(PaginationUtil.countOffset(request))

    const [items, count] = await query.getManyAndCount()

    const meta = PaginationUtil.mapMeta(count, request)

    return {
      meta,
      items
    }
  }

  async createEvent(
    data: eventCreateV1Request
  ): Promise<IEvent> {
    const entity = this.create({
      title: data.title,
      description: data.description,
      categoryId: data.categoryId,
      location: data.location,
      ticketPrice: data.ticketPrice,
      published: data.published,
      quota: data.quota,
      eventDate: data.eventDate
    })

    return await this.save(entity)
  }

  async findOneById(id: string): Promise<IEvent> {
    return await this.findOneOrFail({
      where: { id }
    })
  }

  async updateEvent(entity: Events): Promise<Events> {
    return await this.save(entity)
  }
}