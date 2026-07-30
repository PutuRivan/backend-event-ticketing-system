import { Injectable } from "@nestjs/common";
import { OrderStatusEnum } from "../../../shared/enums/order-status.enum";
import { ITopCategory } from "../interfaces/top-category.interface";
import { ITopEvent } from "../interfaces/top-event.interface";
import { IDashboardV1Repository } from "../interfaces/dashboard-repository.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Orders } from "../../../infrastructures/databases/entities/orders.entity";
import { IOrder } from "../../../infrastructures/databases/interfaces/order.interface";
import { Repository } from "typeorm";
import { IDashboardSummary } from "../interfaces/dashboard-summary.interface";

@Injectable()
export class DashboardV1Repository implements IDashboardV1Repository {

  constructor(
    @InjectRepository(Orders)
    private readonly orderRepository: Repository<IOrder>,
  ) { }


  async getSummary(
    startDate?: Date,
    endDate?: Date,
  ): Promise<IDashboardSummary> {


    const query = this.orderRepository
      .createQueryBuilder("order")
      .select([
        `
        COALESCE(SUM(order.totalPrice),0)
        AS "totalSales"
        `,
        `
        COUNT(order.id)
        AS "totalOrders"
        `,
        `
        COALESCE(SUM(order.quantity),0)
        AS "totalTicketsSold"
        `,
      ])
      .where(
        "order.status = :status",
        {
          status: OrderStatusEnum.PAID
        }
      );


    if (startDate) {
      query.andWhere(
        "order.createdAt >= :startDate",
        {
          startDate
        }
      )
    }


    if (endDate) {
      query.andWhere(
        "order.createdAt <= :endDate",
        {
          endDate
        }
      )
    }


    const result = await query.getRawOne();


    return {
      totalSales: Number(result.totalSales),
      totalOrders: Number(result.totalOrders),
      totalTicketsSold: Number(result.totalTicketsSold),
    };
  }

  async getTopEvents(
    limit = 5,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ITopEvent[]> {


    const query = this.orderRepository
      .createQueryBuilder("order")
      .innerJoin(
        "order.event",
        "event"
      )
      .select([
        "event.id AS \"eventId\"",
        "event.title AS \"title\"",
        `
        SUM(order.totalPrice)
        AS "totalSales"
        `,
        `
        SUM(order.quantity)
        AS "totalTickets"
        `
      ])
      .where(
        "order.status = :status",
        {
          status: OrderStatusEnum.PAID
        }
      )
      .groupBy(
        "event.id"
      )
      .orderBy(
        `"totalSales"`,
        "DESC"
      )
      .limit(limit);


    if (startDate) {
      query.andWhere(
        "order.createdAt >= :startDate",
        {
          startDate
        }
      )
    }


    if (endDate) {
      query.andWhere(
        "order.createdAt <= :endDate",
        {
          endDate
        }
      )
    }


    const result = await query.getRawMany();


    return result.map(item => ({
      eventId: item.eventId,
      title: item.title,
      totalSales: Number(item.totalSales),
      totalTickets: Number(item.totalTickets)
    }));
  }




  async getTopCategories(
    limit = 5,
    startDate?: Date,
    endDate?: Date,
  ): Promise<ITopCategory[]> {


    const query = this.orderRepository
      .createQueryBuilder("order")
      .innerJoin(
        "order.event",
        "event"
      )
      .innerJoin(
        "event.category",
        "category"
      )
      .select([
        "category.id AS \"categoryId\"",
        "category.name AS \"categoryName\"",
        `
        SUM(order.totalPrice)
        AS "totalSales"
        `,
        `
        SUM(order.quantity)
        AS "totalTickets"
        `
      ])
      .where(
        "order.status = :status",
        {
          status: OrderStatusEnum.PAID
        }
      )
      .groupBy(
        "category.id"
      )
      .orderBy(
        `"totalSales"`,
        "DESC"
      )
      .limit(limit);


    if (startDate) {
      query.andWhere(
        "order.createdAt >= :startDate",
        {
          startDate
        }
      )
    }


    if (endDate) {
      query.andWhere(
        "order.createdAt <= :endDate",
        {
          endDate
        }
      )
    }


    const result = await query.getRawMany();


    return result.map(item => ({
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      totalSales: Number(item.totalSales),
      totalTickets: Number(item.totalTickets)
    }));

  }

}