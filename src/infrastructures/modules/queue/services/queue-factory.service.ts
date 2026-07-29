import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { QueueName, TQueueName } from '../constants/queue.constant';
import { IQueueService } from '../interfaces/queue-service.interface';
import { QueueOrderService } from './queue-orders.service';
import { QueueLogActivityService } from './queue-log-activity.service';
import { QueueGenerateTicketService } from './queue-generate-ticket.service';

@Injectable()
export class QueueFactoryService {
    constructor(
        // @InjectQueue(QueueName.Mail)
        // private readonly queueMail: Queue,

        @InjectQueue(QueueName.LogActivity)
        private readonly queueLogActivity: Queue,

        @InjectQueue(QueueName.Orders)
        private readonly queueOrders: Queue,

        @InjectQueue(QueueName.Tickets)
        private readonly queueTickets: Queue
    ) { }

    createQueueService(queueName: TQueueName): IQueueService {
        switch (queueName) {
            // case QueueName.Mail: {
            //     return new QueueMailService(this.queueMail);
            // }
            case QueueName.LogActivity: {
                return new QueueLogActivityService(this.queueLogActivity);
            }
            case QueueName.Orders: {
                return new QueueOrderService(this.queueOrders)
            }
            case QueueName.Tickets: {
                return new QueueGenerateTicketService(this.queueTickets)
            }
            default: {
                throw new Error(
                    `Queue with name ${queueName} is not supported.`,
                );
            }
        }
    }
}
