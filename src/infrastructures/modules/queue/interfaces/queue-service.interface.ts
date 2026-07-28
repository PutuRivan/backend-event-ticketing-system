import { JobsOptions } from 'bullmq';
import { TQueueJob } from '../constants/queue.constant';

export interface IQueueService {
  /**
   * Adds a job to the queue.
   * @param data The data required for the job.
   * @param jobName The name of the job to be added to the queue.
   * @param opts Optional job options such as attempts, backoff strategy, and delay.
   * @returns {Promise<void>} A promise that resolves when the job is added to the queue.
   * @memberof IQueueService
   */
  sendToQueue<T>(
    data: T,
    jobName: TQueueJob,
    opts?: JobsOptions,
  ): Promise<void>;
}
