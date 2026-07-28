import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { EventPaginateV1Request } from '../dtos/requests/event-v1-paginate.request';
import { PaginationUtil } from '../../../shared/utils/pagination.util';
import { Events } from "../../../infrastructures/databases/entities/events.entity";
import { eventCreateV1Request } from "../dtos/requests/event-v1-create.request";
import { IEvent } from "../../../infrastructures/databases/interfaces/event.interface";
import { string } from "zod";
import { QueryFilterUtil } from "../../../shared/utils/query-filter.util";
import { QuerySortingUtil } from "../../../shared/utils/query-sort.util";

@Injectable()
export class EventV1Repository extends Repository<Events> {
  constructor(
    @InjectRepository(Events)
    private readonly repo: Repository<IEvent>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner)
  }

  async paginate(request: EventPaginateV1Request) {
    const alias = this.metadata.name
    console.log("ALIAS:", alias)
    const ALLOWED_SORTS = new Map<string, string>([
      ['event_date', `${alias}.eventDate`],
      ['ticket_price', `${alias}.ticketPrice`],
      ['published', `${alias}.published`],
      ['updated_at', `${alias}.updatedAt`],
    ])

    const query = this.createQueryBuilder(
      this.metadata.name
    ).leftJoinAndSelect(
      `${alias}.category`,
      'category'
    );

    QueryFilterUtil.validateSortValueDto(request, ALLOWED_SORTS)

    QueryFilterUtil.applyFilters(query, {
      search: request.search
        ? {
          term: request.search,
          fields: [
            {
              name: `${alias}.title`,
              type: 'string'
            },
            {
              name: `${alias}.location`,
              type: 'string'
            }
          ]
        } : null,
      filters: [
        {
          field: `${alias}.published`,
          value: request.published
        },
        {
          field: `${alias}.eventDate`,
          value: request.eventDate,
          operator: 'gte'
        },
        {
          field: `${alias}.categoryId`,
          value: request.categoryId
        }
      ]
    })

    QuerySortingUtil.applySorting(query, {
      sort: request.sort,
      order: request.order,
      allowedSorts: ALLOWED_SORTS
    })

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