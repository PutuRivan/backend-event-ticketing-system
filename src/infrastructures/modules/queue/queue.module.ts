import { BullModule, RegisterQueueOptions } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { config } from '../../../config';
import { QueueName } from './constants/queue.constant';
import { QueueOrderProcessor } from './processors/queue-orders.processor';
import { OrdersModule } from '../../../modules/orders/orders.module';
import { QueueFactoryService } from './services/queue-factory.service';


@Module({
  imports: [
    BullModule.registerQueue(
      ...Object.values(QueueName).map<RegisterQueueOptions>((queueName) => ({
        name: queueName,
      })),
    ),

    forwardRef(() => OrdersModule)
  ],
  providers: [
    QueueOrderProcessor,
    QueueFactoryService,
  ],
  exports: [
    BullModule,
    QueueFactoryService
  ]
})
export class QueueModule { }