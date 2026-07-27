import { Processor, WorkerHost } from "@nestjs/bullmq";
import { QueueName, QueueOrderJob } from "../constants/queue.contant";
import { OrdersV1Service } from "../../../../modules/orders/services/orders-v1.service";
import { Job } from "bullmq";

@Processor(QueueName.Order)
export class QueueOrderProcessor extends WorkerHost {
  constructor(
    private readonly ordersService: OrdersV1Service
  ) {
    super();
  }

  async process(job: Job) {

    switch (job.name) {

      case QueueOrderJob.ExpireOrder:

        await this.ordersService.expireOrder(
          job.data.orderId
        );

        break;


      default:
        throw new Error(
          `Unknown job ${job.name}`
        );
    }

  }

}