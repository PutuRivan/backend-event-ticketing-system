import { Repository } from "typeorm";
import { IUser } from "../../../infrastructures/databases/interfaces/user.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../../../infrastructures/databases/entities/users.entity";
import { UserPaginateV1Request } from "../dtos/requests/user-paginate-v1.request";
import { PaginationUtil } from "../../../shared/utils/pagination.util";
import { QueryFilterUtil } from "../../../shared/utils/query-filter.util";
import { QuerySortingUtil } from "../../../shared/utils/query-sort.util";

@Injectable()
export class UserV1Repository extends Repository<IUser> {
  constructor(
    @InjectRepository(Users)
    private readonly repo: Repository<IUser>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async paginate(request: UserPaginateV1Request) {
    const alias = this.metadata.name
    const ALLOWED_SORTS = new Map<string, string>([
      ['updated_at', `${alias}.updatedAt`],
      ['created_at', `${alias}.createdAt`],
      ['deleted_at', `${alias}.deletedAt`]
    ]);

    const query = this.createQueryBuilder(this.metadata.name)

    QueryFilterUtil.validateSortValueDto(request, ALLOWED_SORTS)

    QueryFilterUtil.applyFilters(query, {
      search: request.search ? {
        term: request.search, fields: [
          { name: `${alias}.name`, type: 'string' },
          { name: `${alias}.email`, type: 'string' },
        ]
      } : null,
      filters: [
        {
          field: `${alias}.role`,
          value: request.role
        }
      ]
    })

    QuerySortingUtil.applySorting(query,
      {
        sort: request.sort,
        order: request.order,
        allowedSorts: ALLOWED_SORTS
      })

    query.take(request.perPage);
    query.skip(PaginationUtil.countOffset(request));

    const [items, count] = await query.getManyAndCount();

    const meta = PaginationUtil.mapMeta(count, request);

    return {
      meta,
      items,
    };
  }

  async findOneById(id: string): Promise<IUser | null> {
    const alias = this.metadata.name
    const query = this.createQueryBuilder(this.metadata.name)
      .leftJoinAndSelect(`${alias}.orders`, 'orders')
      .where(`${alias}.id = :id`, { id })
      .getOne();

    return query
  }

  async findOneByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({ where: { email } });
  }

  async updateUser(
    user: Users,
  ): Promise<Users> {
    return await this.save(user);
  }
}