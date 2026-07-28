import { Processor, WorkerHost } from "@nestjs/bullmq";
import { QueueName, QueueOrderJob, QueueTicketJob } from "../constants/queue.constant";
import { TicketsV1Service } from "../../../../modules/tickets/services/tickets-v1.service";
import { Job } from "bullmq";

@Processor(QueueName.Tickets)
export class QueueTicketProcessor extends WorkerHost {
  constructor(
    private readonly ticketsV1Service: TicketsV1Service
  ) { super() }

  async process(job: Job): Promise<void> {
    try {
      const jobName = job.name

      switch (jobName) {

        case QueueTicketJob.GenerateQrCode:
          const qrPath =
            await this.ticketsV1Service.generateQRCode(
              job.data.ticketNumber
            );


          await this.ticketsV1Service.updateQRCode(
            job.data.ticketId,
            qrPath
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