import { EventV1Repository } from '../../events/repositories/events-v1.repository';
import { OrdersV1Repository } from './../repositories/orders-v1.repository';
import { BadRequestException, Injectable, Logger, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { ErrorMessageConstant } from '../../../shared/constants/message.constant';
import { IOrder } from '../../../infrastructures/databases/interfaces/order.interface';
import { OrderPaginateV1Request } from '../dtos/requests/orders-paginate-v1.request';
import { ordersCreateV1Request } from '../dtos/requests/orders-create-v1.request';
import { OrderStatusEnum } from '../../../shared/enums/order-status.enum';
import { TicketsV1Service } from '../../tickets/services/tickets-v1.service';
import { InjectQueue } from '@nestjs/bullmq';
import { QueueName, QueueOrderJob, QueueTicketJob } from '../../../infrastructures/modules/queue/constants/queue.constant';
import { Queue } from 'bullmq';
import { config } from '../../../config';
import { DateTimeUtil } from '../../../shared/utils/datetime.util';
import { IQueueService } from '../../../infrastructures/modules/queue/interfaces/queue-service.interface';
import { QueueFactoryService } from '../../../infrastructures/modules/queue/services/queue-factory.service';
import { IPaginateData } from '../../../shared/interfaces/paginate-response.interface';
import { RemindersV1Service } from '../../reminders/services/reminders-v1.service';
import { IUser } from '../../../infrastructures/databases/interfaces/user.interface';
import { RoleEnum } from '../../../shared/enums/role.enum';
import { DataSource } from 'typeorm';
import { TransactionUtil } from '../../../shared/utils/transaction.util';

@Injectable()
export class OrdersV1Service {
  private queueTicketsService: IQueueService
  private queueOrderService: IQueueService
  private readonly logger = new Logger(OrdersV1Service.name);

  constructor(
    private readonly ordersV1Repository: OrdersV1Repository,
    private readonly eventV1Repository: EventV1Repository,
    private readonly ticketsV1Service: TicketsV1Service,
    private readonly remindersV1Service: RemindersV1Service,
    private readonly queueFactoryService: QueueFactoryService,
    private readonly dataSource: DataSource,
  ) {
    this.queueOrderService = this.queueFactoryService.createQueueService(
      QueueName.Orders,
    );

    this.queueTicketsService = this.queueFactoryService.createQueueService(
      QueueName.Tickets
    )
  }

  private readonly ORDER_EXPIRATION_DELAY_SECONDS = config.queue.orderExpirationDelaySeconds

  async paginate(paginationDto: OrderPaginateV1Request) {
    return await this.ordersV1Repository.paginate(paginationDto)
  }

  async createOrder(
    userId: string,
    dataOrder: ordersCreateV1Request
  ): Promise<IOrder> {
    const newOrder = await TransactionUtil.execute(
      this.dataSource,
      async (queryRunner) => {

        /**
         * Lock event row
         * Agar request lain yang membeli event yang sama
         * harus menunggu transaction ini selesai
         */
        const event =
          await this.eventV1Repository.findOneByIdWithLock(
            dataOrder.eventId,
            queryRunner,
          );


        if (!event) {
          throw new NotFoundException(
            'Event not Found',
          );
        }


        if (!event.published) {
          throw new UnprocessableEntityException(
            ErrorMessageConstant.DataEntityInInvalidState(
              'Event',
              'published',
            ),
          );
        }

        // Hitung tiket yang sudah reserved
        const totalReserved =
          await this.ordersV1Repository.getTotalReservedTicket(
            dataOrder.eventId,
            queryRunner,
          );


        //Cek quota
        if (
          totalReserved + dataOrder.quantity > event.quota
        ) {
          throw new UnprocessableEntityException(
            'Ticket quota exceeded',
          );
        }


        const totalPrice =
          event.ticketPrice * dataOrder.quantity;


        const expiredAt =
          DateTimeUtil.addSeconds(
            new Date(),
            this.ORDER_EXPIRATION_DELAY_SECONDS,
          );


        //Insert order
        const order = await this.ordersV1Repository.createOrder(
          {
            userId,
            eventId: dataOrder.eventId,
            quantity: dataOrder.quantity,
            totalPrice,
            expiredAt,
          },
          queryRunner,
        );


        return order;
      },
    );


    // Schedule order expiration after configured delay
    await this.queueOrderService.sendToQueue(
      {
        orderId: newOrder.id,
      },
      QueueOrderJob.ExpireOrder,
      {
        delay: DateTimeUtil.convertSecondsToMilliseconds(
          this.ORDER_EXPIRATION_DELAY_SECONDS,
        ),
      },
    );


    return newOrder;
  }

  async findOneById(id: string): Promise<IOrder> {
    const order = await this.ordersV1Repository.findOneById(id)

    if (!order) {
      throw new NotFoundException(
        ErrorMessageConstant.DataEntityNotFound('Order'),
      );
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
      throw new NotFoundException(
        ErrorMessageConstant.DataEntityNotFound('Order'),
      );
    }

    return order;
  }

  async findOneByIdWithPermission(
    orderId: string,
    user: IUser,
  ): Promise<IOrder> {

    let order: IOrder | null;
    const userRole = user.role
    const adminRole = RoleEnum.ADMIN

    if (userRole === adminRole) {
      order = await this.ordersV1Repository.findOneById(orderId);
    } else {
      order =
        await this.ordersV1Repository.findOneByIdAndUserId(
          orderId,
          user.id,
        );
    }

    if (!order) {
      throw new NotFoundException(
        ErrorMessageConstant.DataEntityNotFound('Order'),
      );
    }

    return order;
  }

  async paginateByUserId(
    userId: string,
    paginationDto: OrderPaginateV1Request,
  ): Promise<IPaginateData<IOrder>> {
    return await this.ordersV1Repository.paginateByUserId(
      userId,
      paginationDto,
    );
  }

  async paymentOrder(
    userId: string,
    orderId: string,
  ): Promise<IOrder> {

    const result = await TransactionUtil.execute(
      this.dataSource,
      async (queryRunner) => {
        // this.logger.debug(`payment tx start orderId=${orderId} userId=${userId}`);
        // Ambil order + lock row
        const order =
          await this.ordersV1Repository.findOneByIdAndUserIdWithLock(
            orderId,
            userId,
            queryRunner,
          );


        if (!order) {
          throw new NotFoundException(
            'Order Not Found',
          );
        }


        if (
          order.status !== OrderStatusEnum.PENDING
        ) {
          throw new UnprocessableEntityException(
            'Payment Failed',
          );
        }

        // load event setelah lock
        const event =
          await this.eventV1Repository.findOneById(
            order.eventId,
          );
        if (!event) {
          throw new NotFoundException(
            'Event Not Found',
          );
        }

        order.event = event;

        // Update status payment
        order.status = OrderStatusEnum.PAID;
        order.paidAt = new Date();


        const savedOrder =
          await this.ordersV1Repository.saveWithTransaction(
            order,
            queryRunner,
          );

        await this.ticketsV1Service.createTicket(
          savedOrder.id,
          savedOrder.quantity,
          queryRunner,
        );

        // Create reminder
        await this.remindersV1Service.createReminders(
          savedOrder,
          queryRunner,
        );

        return savedOrder;
      },
    );


    /**
     * Transaction sudah commit
     * Baru kirim queue
     */
    const tickets =
      await this.ticketsV1Service.findByOrderId(
        result.id,
      );


    for (const ticket of tickets) {
      // this.logger.debug(`enqueue QR ticketId=${ticket.id}`);
      await this.queueTicketsService.sendToQueue(
        {
          ticketId: ticket.id,
          ticketNumber: ticket.ticketNumber,
        },
        QueueTicketJob.GenerateQrCode,
      );

    }


    return result;
  }

  async markTicketEmailSent(
    id: string
  ): Promise<boolean> {

    return this.ordersV1Repository.markTicketEmailSent(id);

  }

  async cancelOrder(
    userId: string,
    orderId: string
  ): Promise<IOrder> {
    // Cek Order
    const order = await this.ordersV1Repository.findOneByIdAndUserId(orderId, userId)

    if (!order) {
      throw new NotFoundException('Order Not Found')
    }

    if (order.status !== OrderStatusEnum.PENDING) {
      throw new UnprocessableEntityException(
        'Order cannot be cancelled',
      );
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