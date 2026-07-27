import { EventCategoriesV1Repository } from './../../event-categories/repositories/event-categories-v1.repository';
import { EventV1Repository } from '../../events/repositories/events-v1.repository';
import { OrdersV1Repository } from './../repositories/orders-v1.repository';
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { IOrder } from '../../../infrastructures/databases/interfaces/order.interface';
import { OrderPaginateV1Request } from '../dtos/requests/orders-paginate-v1.request';
import { ordersCreateV1Request } from '../dtos/requests/orders-create-v1.request';
import { OrderStatusEnum } from '../../../shared/enums/order-status.enum';

@Injectable()
export class OrdersV1Service {
  constructor(
    private readonly ordersV1Repository: OrdersV1Repository,
    private readonly eventV1Repository: EventV1Repository,
  ) { }

  async paginate(paginationDto: OrderPaginateV1Request) {
    return await this.ordersV1Repository.paginate(paginationDto)
  }

  async createOrder(
    dataOrder: ordersCreateV1Request
  ): Promise<IOrder> {
    // Cek Event
    const event = await this.eventV1Repository.findOneById(dataOrder.eventId)

    if (!event) {
      throw new NotFoundException('Event not Found')
    }

    if (!event.published) {
      throw new BadRequestException('Event Not Published')
    }

    const totalReserved = await this.ordersV1Repository.getTotalReservedTicket(dataOrder.eventId)

    if (totalReserved + dataOrder.quantity > event.quota) {
      throw new BadRequestException(
        "Ticket quota exceeded"
      );
    }

    const totalPrice = event.ticketPrice * dataOrder.quantity
    const expiredAt = new Date(
      Date.now() + 15 * 60 * 1000
    );

    return await this.ordersV1Repository.createOrder(dataOrder, totalPrice, expiredAt)
  }

  async findOneById(id: string): Promise<IOrder> {
    return await this.ordersV1Repository.findOneById(id)
  }

  async paymentOrder(
    idOrder: string
  ): Promise<IOrder> {
    // Cek Order
    const order = await this.ordersV1Repository.findOneById(idOrder)

    if (!order) {
      throw new NotFoundException('Order Not Found')
    }

    if (order.status !== OrderStatusEnum.PENDING) {
      throw new BadRequestException(
        "Payment Failed"
      )
    }

    order.status = OrderStatusEnum.PAID;
    order.paidAt = new Date();

    return await this.ordersV1Repository.save(order);
  }

  async cancelOrder(
    idOrder: string
  ): Promise<IOrder> {
    // Cek Order
    const order = await this.ordersV1Repository.findOneById(idOrder)

    if (!order) {
      throw new NotFoundException('Order Not Found')
    }

    if (order.status !== OrderStatusEnum.PENDING) {
      throw new BadRequestException(
        "Order cannot be cancelled"
      )
    }

    order.status = OrderStatusEnum.CANCELLED;

    return await this.ordersV1Repository.save(order);
  }
}