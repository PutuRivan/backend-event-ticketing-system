import { Injectable } from "@nestjs/common";
import { IQueueService } from "../interfaces/queue-service.interface";
import { InjectQueue } from "@nestjs/bullmq";
import { QueueName, TQueueTicketJob } from "../constants/queue.constant";
import { JobsOptions, Queue } from "bullmq";

@Injectable()
export class QueueGenerateTicketService implements IQueueService {
  constructor(
    @InjectQueue(QueueName.Tickets)
    private readonly queue: Queue
  ) { }

  async sendToQueue<T>(
    data: T,
    jobName: TQueueTicketJob,
    opts?: JobsOptions
  ): Promise<void> {
    try {
      await this.queue.add(jobName, data, opts);
    } catch (error: any) {
      throw new Error(`Failed to add job to the queue: ${error.message}`);
    }
  }
}