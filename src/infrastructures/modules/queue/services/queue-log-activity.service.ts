import { JobsOptions, Queue } from "bullmq";
import { IQueueService } from "../interfaces/queue-service.interface";
import { TQueueLogActivityJob } from "../constants/queue.constant";

export class QueueLogActivityService implements IQueueService {
  constructor(
    private readonly queue: Queue
  ) { }

  async sendToQueue<T>(
    data: T,
    jobName: TQueueLogActivityJob,
    opts?: JobsOptions,
  ): Promise<void> {
    try {
      await this.queue.add(jobName, data, opts);
    } catch (error: any) {
      throw new Error(`Failed to add job to the queue: ${error.message}`);
    }
  }
}