import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { EventCategories } from "../../../infrastructures/databases/entities/event-categories.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { IEventCategories } from "../../../infrastructures/databases/interfaces/event-categories.interface";
import { EventCategoriesPaginateV1Request } from "../dtos/requests/event-categories-paginate-v1.request";
import { PaginationUtil } from "../../../shared/utils/pagination.util";
import { EventCategoriesCreateV1Request } from "../dtos/requests/event-categories-create-v1.request";
import { QueryFilterUtil } from "../../../shared/utils/query-filter.util";

@Injectable()
export class EventCategoriesV1Repository extends Repository<EventCategories> {
  constructor(
    @InjectRepository(EventCategories)
    private readonly repo: Repository<EventCategories>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async paginate(request: EventCategoriesPaginateV1Request) {
    const alias = this.metadata.name
    const query = this.createQueryBuilder(this.metadata.name)

    QueryFilterUtil.applyFilters(query, {
      search: request.search
        ? {
          term: request.search,
          fields: [
            { name: `${alias}.name`, type: 'string' }
          ]
        } : null
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

  async createEventCategory(
    data: EventCategoriesCreateV1Request,
  ): Promise<IEventCategories> {

    const entity = this.create({
      name: data.name,
      description: data.description,
    });

    return await this.save(entity);
  }

  async findOneById(id: string): Promise<IEventCategories | null> {
    return await this.findOne({
      where: { id }
    })
  }

  async updateEventCategory(
    id: string,
    entity: Partial<EventCategories>,
  ): Promise<boolean> {
    const update = await this.update(id, entity)

    if (update.affected === 0) {
      return false
    }

    return true;
  }
}
