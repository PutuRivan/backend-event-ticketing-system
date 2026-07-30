import { Injectable } from "@nestjs/common";
import { IQueueService } from "../interfaces/queue-service.interface";
import { JobsOptions, Queue } from "bullmq";
import { QueueName, TQueueReminderJob } from "../constants/queue.constant";
import { InjectQueue } from "@nestjs/bullmq";

@Injectable()
export class QueueReminderService implements IQueueService {
  constructor(
    @InjectQueue(QueueName.Reminder)
    private readonly queue: Queue,
  ) { }

  async sendToQueue<T>(
    data: T,
    jobName: TQueueReminderJob,
    opts?: JobsOptions
  ): Promise<void> {
    try {
      console.log(
        "ADD REMINDER JOB",
        {
          jobName,
          data,
          opts
        }
      );
      await this.queue.add(jobName, data, opts);
    } catch (error: any) {
      throw new Error(`Failed to add job to the queue: ${error.message}`);
    }
  }
}