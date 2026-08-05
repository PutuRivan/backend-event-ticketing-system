import { Repository } from "typeorm";
import { Tickets } from "../../../infrastructures/databases/entities/tickets.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ITicket } from "../../../infrastructures/databases/interfaces/ticket.interface";
import { TicketPaginateV1Request } from "../dtos/requests/tickets-paginate-v1.request";
import { IPaginateData } from "../../../shared/interfaces/paginate-response.interface";
import { QueryFilterUtil } from "../../../shared/utils/query-filter.util";
import { QuerySortingUtil } from "../../../shared/utils/query-sort.util";
import { PaginationUtil } from "../../../shared/utils/pagination.util";

@Injectable()
export class TicketsV1Repository extends Repository<ITicket> {
  constructor(
    @InjectRepository(Tickets)
    private readonly repo: Repository<ITicket>
  ) {
    super(repo.target, repo.manager, repo.queryRunner)
  }

  async paginate(
    request: TicketPaginateV1Request
  ): Promise<IPaginateData<ITicket>> {
    const alias = this.metadata.name
    const ALLOWED_SORTS = new Map<string, string>([
      ['updated_at', `${alias}.updatedAt`],
      ['created_at', `${alias}.createdAt`],
    ])

    const query = this
      .createQueryBuilder(this.metadata.name)
      .leftJoinAndSelect(`${alias}.order`, 'order')

    QueryFilterUtil.validateSortValueDto(request, ALLOWED_SORTS)

    QueryFilterUtil.applyFilters(query, {
      search: request.search ?
        {
          term: request.search,
          fields: [
            {
              name: `${alias}.ticketNumber`, type: 'string'
            }
          ]
        } : null,
    })

    QuerySortingUtil.applySorting(query, {
      sort: request.sort,
      order: request.order,
      allowedSorts: ALLOWED_SORTS,
    });

    query.take(request.perPage);
    query.skip(PaginationUtil.countOffset(request));

    const [items, count] = await query.getManyAndCount();

    const meta = PaginationUtil.mapMeta(count, request);

    return {
      meta,
      items,
    };
  }

  async findOneById(id: string): Promise<ITicket | null> {
    return await this.findOne({
      where: { id }
    })
  }

  async findByOrderId(
    orderId: string,
  ): Promise<ITicket[]> {

    return await this.find({
      where: {
        orderId,
      },
      relations: {
        order: {
          user: true,
          event: true
        }
      }
    });

  }
}