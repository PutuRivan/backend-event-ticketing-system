import { Processor, WorkerHost } from "@nestjs/bullmq";
import { QueueName, QueueOrderJob } from "../constants/queue.constant";
import { OrdersV1Service } from "../../../../modules/orders/services/orders-v1.service";
import { Job } from "bullmq";

@Processor(QueueName.Orders)
export class QueueOrderProcessor extends WorkerHost {
  constructor(
    private readonly ordersService: OrdersV1Service
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    try {
      const jobName = job.name

      switch (jobName) {

        case QueueOrderJob.ExpireOrder:
          await this.ordersService.expireOrder(
            job.data.orderId
          );
          break;


        default:
          throw new Error(
            `Unknown job ${jobName}`
          );
      }
    } catch (error: any) {
      throw new Error(`Failed to process job: ${error.message}`);
    }


  }

}