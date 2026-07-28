import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QueueName, TQueueName } from '../constants/queue.constant';
import { IQueueService } from '../interfaces/queue-service.interface';
import { QueueOrderService } from './queue-orders.service';

@Injectable()
export class QueueFactoryService {
    constructor(
        // @InjectQueue(QueueName.Mail)
        // private readonly queueMail: Queue,

        // @InjectQueue(QueueName.LogActivity)
        // private readonly queueLogActivity: Queue,

        @InjectQueue(QueueName.Order)
        private readonly queueOrder: Queue
        // TODO: Inject your other queues here
    ) { }

    createQueueService(queueName: TQueueName): IQueueService {
        switch (queueName) {
            // case QueueName.Mail: {
            //     return new QueueMailService(this.queueMail);
            // }
            // case QueueName.LogActivity: {
            //     return new QueueLogActivityService(this.queueLogActivity);
            // }
            case QueueName.Order: {
                return new QueueOrderService(this.queueOrder)
            }
            // TODO: Add other queue services here
            default: {
                throw new Error(
                    `Queue with name ${queueName} is not supported.`,
                );
            }
        }
    }
}
