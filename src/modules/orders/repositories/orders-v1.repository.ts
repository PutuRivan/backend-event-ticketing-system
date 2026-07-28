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

@Injectable()
export class OrdersV1Repository extends Repository<IOrder> {
  constructor(
    @InjectRepository(Orders)
    private readonly repo: Repository<IOrder>
  ) {
    super(repo.target, repo.manager, repo.queryRunner)
  }

  async paginate(request: OrderPaginateV1Request) {
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

  async findOneById(id: string): Promise<IOrder> {
    return await this.findOneOrFail({
      where: { id }
    })
  }

  async getTotalReservedTicket(eventId: string): Promise<number> {
    const result = await this
      .createQueryBuilder("order")
      .select("COALESCE(SUM(order.quantity), 0)", "total")
      .where("order.eventId = :eventId", { eventId })
      .andWhere("order.status IN (:...statuses)", {
        statuses: [
          OrderStatusEnum.PENDING,
          OrderStatusEnum.PAID,
        ],
      })
      .getRawOne();

    return Number(result.total);
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

  async paginateByUserId(
    userId: string,
    paginationDto: OrderPaginateV1Request,
  ): Promise<IPaginateData<IOrder>> {
    const {
      page = 1,
      perPage = 10,
      search,
      sort = 'updated_at',
      order = PaginateOrderEnum.DESC,
    } = paginationDto;

    const qb = this.createQueryBuilder('orders')
      .leftJoinAndSelect('orders.event', 'event')
      .where('orders.userId = :userId', { userId });

    if (search) {
      qb.andWhere('event.title ILIKE :search', {
        search: `%${search}%`,
      });
    }

    qb
      .orderBy(`orders.${sort}`, order)
      .skip((page - 1) * perPage)
      .take(perPage);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      meta: {
        page,
        perPage,
        total,
        totalPage: Math.ceil(total / perPage),
      },
    };
  }
}
