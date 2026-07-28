import { InjectQueue } from '@nestjs/bullmq';
import { QueueName, TQueueOrderJob } from '../constants/queue.constant';
import { Injectable } from "@nestjs/common";
import { JobsOptions, Queue } from 'bullmq';
import { IQueueService } from '../interfaces/queue-service.interface';

@Injectable()
export class QueueOrderService implements IQueueService {
  constructor(
    @InjectQueue(QueueName.Order)
    private readonly queue: Queue
  ) { }

  async sendToQueue<T>(
    data: T,
    jobName: TQueueOrderJob,
    opts?: JobsOptions
  ): Promise<void> {
    try {
      await this.queue.add(jobName, data, opts);
    } catch (error: any) {
      throw new Error(`Failed to add job to the queue: ${error.message}`);
    }


  }
}
