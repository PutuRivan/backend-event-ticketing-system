import { JobsOptions, Queue } from 'bullmq';
import { QueueName, TQueueMailJob } from '../constants/queue.constant';
import { IQueueService } from '../interfaces/queue-service.interface';
import { InjectQueue } from '@nestjs/bullmq';

export class QueueMailService implements IQueueService {
    constructor(
        @InjectQueue(QueueName.Mail)
        private readonly queue: Queue
    ) { }

    async sendToQueue<T>(
        data: T,
        jobName: TQueueMailJob,
        opts?: JobsOptions,
    ): Promise<void> {
        try {
            console.log("ADD MAIL JOB", {
                jobName,
                data,
                opts
            });
            await this.queue.add(jobName, data, opts);
        } catch (error: any) {
            throw new Error(`Failed to add job to the queue: ${error.message}`);
        }
    }
}
