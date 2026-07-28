import { BullModule, RegisterQueueOptions } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { config } from '../../../config';
import { QueueName } from './constants/queue.constant';
import { QueueOrderProcessor } from './processors/queue-orders.processor';
import { OrdersModule } from '../../../modules/orders/orders.module';
import { QueueFactoryService } from './services/queue-factory.service';
import { LogActivityModule } from '../../../modules/log-activity/log-activity.module';
import { QueueLogActivityProcessor } from './processors/queue-log-activity.processor';


@Module({
  imports: [
    BullModule.registerQueue(
      ...Object.values(QueueName).map<RegisterQueueOptions>((queueName) => ({
        name: queueName,
      })),
    ),

    forwardRef(() => OrdersModule),
    LogActivityModule
  ],
  providers: [
    QueueOrderProcessor,
    QueueLogActivityProcessor,
    QueueFactoryService,
  ],
  exports: [
    BullModule,
    QueueFactoryService
  ]
})
export class QueueModule { }