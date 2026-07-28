import { Processor, WorkerHost } from "@nestjs/bullmq";
import { QueueLogActivityJob, QueueName } from "../constants/queue.constant";
import { LogActivityV1Service } from "../../../../modules/log-activity/services/log-activity-v1.service";
import { Job } from "bullmq";
import { Logger } from "@nestjs/common";

@Processor(QueueName.LogActivity)
export class QueueLogActivityProcessor extends WorkerHost {
  constructor(
    private readonly logActivityService: LogActivityV1Service
  ) {
    super();
  }

  private readonly logger = new Logger(QueueLogActivityProcessor.name);

  async process(job: Job, _token?: string): Promise<void> {
    try {
      const jobName = job.name;

      if (jobName === QueueLogActivityJob.LogActivityCreate) {
        this.logger.log(
          `Processing job: ${jobName} with data: ${JSON.stringify(
            job.data,
          )}`,
        );

        await this.logActivityService.queueLogActivityCreate(
          job.data,
        );
      } else {
        throw new Error(`Unknown job name: ${jobName}`);
      }
    } catch (error: any) {
      // console.error(`Error processing job: ${error.message}`);
      throw new Error(`Failed to process job: ${error.message}`);
    }
  }
}