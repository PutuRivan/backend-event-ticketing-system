import { QuerySortingUtil } from './../../../shared/utils/query-sort.util';
import { QueryFilterUtil } from './../../../shared/utils/query-filter.util';
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ILogActivity } from "../../../infrastructures/databases/interfaces/log-activity.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { LogActivity } from "../../../infrastructures/databases/entities/log-activity.entity";
import { LogActivityPaginateV1Request } from "../dtos/requests/log-activity-paginate-v1.request";
import { PaginationUtil } from '../../../shared/utils/pagination.util';

@Injectable()
export class LogActivityV1Repository extends Repository<ILogActivity> {
  constructor(
    @InjectRepository(LogActivity)
    private readonly repo: Repository<ILogActivity>
  ) {
    super(repo.target, repo.manager, repo.queryRunner)
  }

  async paginate(
    request: LogActivityPaginateV1Request,
  ) {
    const alias = this.metadata.name;
    const ALLOWED_SORTS = new Map<string, string>([
      ['source', `${alias}.source`],
      ['activity', `${alias}.activity`],
      ['menu', `${alias}.menu`],
      ['path', `${alias}.path`],
      ['updated_at', `${alias}.updatedAt`],
      ['created_at', `${alias}.createdAt`],
    ]);

    const query = this.createQueryBuilder(
      this.metadata.name,
    ).leftJoinAndSelect(`${alias}.user`, 'user');

    // Validate the sort value in the request
    QueryFilterUtil.validateSortValueDto(request, ALLOWED_SORTS);

    QueryFilterUtil.applyFilters(query, {
      search: request.search
        ? {
          term: request.search,
          fields: [
            { name: `${alias}.source`, type: 'string' },
            { name: `${alias}.activity`, type: 'string' },
            { name: `${alias}.menu`, type: 'string' },
            { name: `${alias}.path`, type: 'string' },
          ],
        }
        : null,
      filters: [],
    });

    // Handle sort
    QuerySortingUtil.applySorting(query, {
      sort: request.sort,
      order: request.order,
      allowedSorts: ALLOWED_SORTS,
    });

    // Handle pagination
    query.take(request.perPage);
    query.skip(PaginationUtil.countOffset(request));

    const [items, count] = await query.getManyAndCount();

    const meta = PaginationUtil.mapMeta(count, request);

    return {
      meta,
      items,
    };
  }
}
