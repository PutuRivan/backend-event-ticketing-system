import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { IOrder } from "../../../infrastructures/databases/interfaces/order.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Orders } from "../../../infrastructures/databases/entities/orders.entity";
import { OrderPaginateV1Request } from "../dtos/requests/orders-paginate-v1.request";
import { PaginationUtil } from "../../../shared/utils/pagination.util";
import { OrderStatusEnum } from "../../../shared/enums/order-status.enum";
import { ordersCreateV1Request } from "../dtos/requests/orders-create-v1.request";
import { ICreateOrder } from "../interfaces/create-order.interface";
import { IPaginateData } from "../../../shared/interfaces/paginate-response.interface";
import { PaginateOrderEnum } from "../../../shared/enums/paginate-order.enum";
import { QueryFilterUtil } from "../../../shared/utils/query-filter.util";
import { QuerySortingUtil } from "../../../shared/utils/query-sort.util";

@Injectable()
export class OrdersV1Repository extends Repository<IOrder> {
  constructor(
    @InjectRepository(Orders)
    private readonly repo: Repository<IOrder>
  ) {
    super(repo.target, repo.manager, repo.queryRunner)
  }

  async paginate(request: OrderPaginateV1Request) {
    const alias = this.metadata.name
    const ALLOWED_SORT = new Map<string, string>([
      ['created_at', `${alias}.createdAt`],
      ['updated_at', `${alias}.updatedAt`]
    ])

    const query = this
      .createQueryBuilder(this.metadata.name)
      .leftJoinAndSelect(`${alias}.tickets`, 'tickets')
      .leftJoinAndSelect(`${alias}.event`, 'event')

    QueryFilterUtil.validateSortValueDto(request, ALLOWED_SORT)

    QueryFilterUtil.applyFilters(query, {
      filters: [
        {
          field: `${alias}.status`,
          value: request.status
        },
        {
          field: `${alias}.eventId`,
          value: request.eventId
        },
        {
          field: `${alias}.userId`,
          value: request.userId
        }
      ]
    })

    QuerySortingUtil.applySorting(query, {
      sort: request.sort,
      order: request.order,
      allowedSorts: ALLOWED_SORT
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

  async findOneById(id: string): Promise<IOrder | null> {
    const alias = this.metadata.name
    const query = this
      .createQueryBuilder(alias)
      .leftJoinAndSelect(`${alias}.user`, 'users')
      .leftJoinAndSelect(`${alias}.event`, 'event')
      .leftJoinAndSelect(`${alias}.tickets`, 'tickets')
      .where(`${alias}.id = :id`, { id })
      .getOne()

    return query
  }

  async getTotalReservedTicket(eventId: string): Promise<number> {
    const alias = this.metadata.name
    const query = this.createQueryBuilder(this.metadata.name)
      .select(
        `COALESCE(SUM(${alias}.quantity), 0)`,
        'total'
      );

    QueryFilterUtil.applyFilters(query, {
      filters: [
        {
          field: `${alias}.eventId`,
          value: eventId,
        },
        {
          field: `${alias}.status`,
          value: [
            OrderStatusEnum.PENDING,
            OrderStatusEnum.PAID,
          ],
          operator: 'in',
        },
      ],
    });

    const result = await query.getRawOne<{ total: string }>();

    return Number(result?.total);
  }

  async createOrder(
    data: ICreateOrder
  ): Promise<IOrder> {
    const entity = this.create({
      userId: data.userId,
      eventId: data.eventId,
      quantity: data.quantity,
      totalPrice: data.totalPrice,
      status: OrderStatusEnum.PENDING,
      expiredAt: data.expiredAt
    })

    return await this.save(entity)
  }

  async markTicketEmailSent(
    id: string
  ): Promise<boolean> {

    const result =
      await this.update(
        {
          id,
          ticketEmailSent: false,
        },
        {
          ticketEmailSent: true,
        },
      );

    return result.affected === 1;
  }

  async findOneByIdAndUserId(
    orderId: string,
    userId: string,
  ): Promise<IOrder | null> {
    return this.findOne({
      where: {
        id: orderId,
        userId,
      },
    });
  }

}
