import { EventV1Repository } from '../../events/repositories/events-v1.repository';
import { OrdersV1Repository } from './../repositories/orders-v1.repository';
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { IOrder } from '../../../infrastructures/databases/interfaces/order.interface';
import { OrderPaginateV1Request } from '../dtos/requests/orders-paginate-v1.request';
import { ordersCreateV1Request } from '../dtos/requests/orders-create-v1.request';
import { OrderStatusEnum } from '../../../shared/enums/order-status.enum';
import { TicketsV1Service } from '../../tickets/services/tickets-v1.service';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueName, QueueOrderJob } from '../../../infrastructures/modules/queue/constants/queue.constant';
import { Queue } from 'bullmq';
import { config } from '../../../config';
import { DateTimeUtil } from '../../../shared/utils/datetime.util';
import { IQueueService } from '../../../infrastructures/modules/queue/interfaces/queue-service.interface';
import { QueueFactoryService } from '../../../infrastructures/modules/queue/services/queue-factory.service';
import { IPaginateData } from '../../../shared/interfaces/paginate-response.interface';

@Injectable()
export class OrdersV1Service {
  private queueOrderService: IQueueService

  constructor(
    private readonly ordersV1Repository: OrdersV1Repository,
    private readonly eventV1Repository: EventV1Repository,
    private readonly ticketsV1Service: TicketsV1Service,
    private readonly queueFactoryService: QueueFactoryService,
  ) {
    this.queueOrderService = this.queueFactoryService.createQueueService(
      QueueName.Orders,
    );
  }

  private readonly ORDER_EXPIRATION_DELAY_SECONDS = config.queue.orderExpirationDelaySeconds

  async paginate(paginationDto: OrderPaginateV1Request) {
    return await this.ordersV1Repository.paginate(paginationDto)
  }

  async createOrder(
    userId: string,
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
    const expiredAt = DateTimeUtil.addSeconds(
      new Date(),
      this.ORDER_EXPIRATION_DELAY_SECONDS
    );

    const newOrder = await this.ordersV1Repository.createOrder(
      {
        userId,
        eventId: dataOrder.eventId,
        quantity: dataOrder.quantity,
        totalPrice,
        expiredAt
      }
    )

    await this.queueOrderService.sendToQueue(
      {
        orderId: newOrder.id
      },
      QueueOrderJob.ExpireOrder,
      {
        delay: DateTimeUtil.convertSecondsToMilliseconds(
          this.ORDER_EXPIRATION_DELAY_SECONDS
        )
      }
    );

    return newOrder
  }

  async findOneById(id: string): Promise<IOrder> {
    const order = await this.ordersV1Repository.findOneById(id)

    if (!order) {
      throw new NotFoundException("Order Not Found")
    }

    return order
  }

  async findOneByIdAndUserId(
    orderId: string,
    userId: string,
  ): Promise<IOrder> {
    const order = await this.ordersV1Repository.findOneByIdAndUserId(
      orderId,
      userId,
    );

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  // async paginateByUserId(
  //   userId: string,
  //   paginationDto: OrderPaginateV1Request,
  // ): Promise<IPaginateData<IOrder>> {
  //   return await this.ordersV1Repository.paginateByUserId(
  //     userId,
  //     paginationDto,
  //   );
  // }

  async paymentOrder(
    idOrder: string
  ): Promise<IOrder> {
    // Cek Order
    const order = await this.ordersV1Repository.findOneById(idOrder)

    if (!order) {
      throw new NotFoundException('Order Not Found')
    }
    // Cek Order Status
    if (order.status !== OrderStatusEnum.PENDING) {
      throw new BadRequestException(
        "Payment Failed"
      )
    }

    order.status = OrderStatusEnum.PAID;
    order.paidAt = new Date();

    const savedOrder = await this.ordersV1Repository.save(order);


    for (let i = 0; i < savedOrder.quantity; i++) {
      await this.ticketsV1Service.createTicket(savedOrder.id);
    }

    return savedOrder;
  }

  async markTicketEmailSent(
    id: string
  ): Promise<boolean> {

    return this.ordersV1Repository.markTicketEmailSent(id);

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

  async expireOrder(
    idOrder: string
  ): Promise<void> {
    const order =
      await this.ordersV1Repository.findOneById(
        idOrder
      );


    if (!order) {
      return;
    }


    if (
      order.status !== OrderStatusEnum.PENDING
    ) {
      return;
    }


    await this.ordersV1Repository.update(
      idOrder,
      {
        status: OrderStatusEnum.EXPIRED
      }
    );

  }
}