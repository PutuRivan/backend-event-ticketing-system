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
import { QueueGenerateTicketService } from "./services/queue-generate-ticket.service";
import { QueueOrderService } from "./services/queue-orders.service";
import { QueueLogActivityService } from "./services/queue-log-activity.service";
import { QrCodeModule } from '../qr/qr-code.module';
import { PdfModule } from '../pdf/pdf.module';
import { StorageModule } from '../storage/storage.module';

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
    QrCodeModule,
    PdfModule,
    StorageModule
  ],
  providers: [
    QueueOrderProcessor,
    QueueTicketProcessor,
    QueueLogActivityProcessor,

    QueueFactoryService,

    QueueOrderService,
    QueueGenerateTicketService,
    QueueLogActivityService,
  ],
  exports: [
    BullModule,
    QueueFactoryService,

    QueueOrderService,
    QueueGenerateTicketService,
    QueueLogActivityService,
  ]
})
export class QueueModule { }