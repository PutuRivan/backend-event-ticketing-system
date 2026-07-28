import { BullModule, RegisterQueueOptions } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { config } from '../../../config';
import { QueueName } from './constants/queue.constant';
import { QueueOrderProcessor } from './processors/queue-orders.processor';
import { OrdersModule } from '../../../modules/orders/orders.module';
import { QueueFactoryService } from './services/queue-factory.service';
import { LogActivityModule } from '../../../modules/log-activity/log-activity.module';
import { QueueLogActivityProcessor } from './processors/queue-log-activity.processor';
import { QueueTicketProcessor } from './processors/queue-tickets.processor';
import { TicketsModule } from '../../../modules/tickets/tickets.module';
import { QueueOrderService } from './services/queue-orders.service';
import { QueueTicketService } from './services/queue-generate-qr.service';
import { QueueLogActivityService } from './services/queue-log-activity.service';


@Module({
  imports: [
    BullModule.registerQueue(
      ...Object.values(QueueName).map<RegisterQueueOptions>((queueName) => ({
        name: queueName,
      })),
    ),

    forwardRef(() => OrdersModule),
    forwardRef(() => TicketsModule),
    LogActivityModule,
  ],
  providers: [
    QueueOrderProcessor,
    QueueTicketProcessor,
    QueueLogActivityProcessor,

    QueueFactoryService,
    QueueOrderService,
    QueueTicketService,
    QueueLogActivityService
  ],
  exports: [
    BullModule,
    QueueFactoryService
  ]
})
export class QueueModule { }