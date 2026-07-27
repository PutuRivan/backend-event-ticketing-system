import { BullModule, RegisterQueueOptions } from '@nestjs/bullmq';
import { forwardRef, Module } from '@nestjs/common';
import { config } from '../../../config';
import { QueueName } from './constants/queue.contant';
import { QueueOrderProcessor } from './processors/queue-orders.processor';
import { OrdersModule } from '../../../modules/orders/orders.module';


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
    QueueOrderProcessor
  ],
  exports: [
    BullModule
  ]
})
export class QueueModule { }