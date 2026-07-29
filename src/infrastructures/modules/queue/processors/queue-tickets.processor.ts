import { Processor, WorkerHost } from "@nestjs/bullmq";
import { QueueName, QueueOrderJob, QueueTicketJob } from "../constants/queue.constant";
import { TicketsV1Service } from "../../../../modules/tickets/services/tickets-v1.service";
import { Job } from "bullmq";
import { QueueGenerateTicketService } from "../services/queue-generate-ticket.service";
import { PdfService } from "../../pdf/services/pdf.service";
import { QrCodeService } from "../../qr/services/qr-code.service";
import { StorageFactoryService } from "../../storage/services/storage-factory.service";
import { IStorageService } from "../../storage/interfaces/storage.interface";
import { StorageDriver } from "../../storage/constant/storage.constant";

@Processor(QueueName.Tickets)
export class QueueTicketProcessor extends WorkerHost {
  private storageService: IStorageService;
  constructor(
    private readonly ticketsV1Service: TicketsV1Service,
    private readonly queueTicketService: QueueGenerateTicketService,
    private readonly pdfService: PdfService,
    private readonly qrCodeService: QrCodeService,
    private readonly storageFactoryService: StorageFactoryService,

  ) {
    super();

    this.storageService =
      this.storageFactoryService.createStorageService(
        StorageDriver.Local
      );
  }

  async process(job: Job): Promise<void> {
    try {
      const jobName = job.name

      switch (jobName) {

        case QueueTicketJob.GenerateQrCode:
          const qrBuffer =
            await this.qrCodeService.generate({
              value: job.data.ticketNumber
            });

          const qrPath =
            await this.storageService.uploadToStorage({
              folder: "qrcode",
              filename: `${job.data.ticketNumber}.png`,
              buffer: qrBuffer
            });

          await this.ticketsV1Service.updateQRCode(
            job.data.ticketId,
            qrPath
          );


          await this.queueTicketService.sendToQueue(
            {
              ticketId: job.data.ticketId
            },
            QueueTicketJob.GeneratePdf
          );

          break;
        case QueueTicketJob.GeneratePdf:
          console.log("START PDF");

          const ticket =
            await this.ticketsV1Service.findOneByID(
              job.data.ticketId
            );

          console.log("TICKET", ticket)

          const qrCode =
            await this.storageService.getFromStorage({
              path: `qrcode/${ticket.ticketNumber}.png`
            });


          const pdfBuffer =
            await this.pdfService.generate({
              ticketNumber:
                ticket.ticketNumber,

              eventName:
                ticket.order.event.title,

              userName:
                ticket.order.user.name,

              eventDate:
                ticket.order.event.eventDate,

              location:
                ticket.order.event.location,

              qrCode
            });

          const pdfPath =
            await this.storageService.uploadToStorage({
              folder: "pdf",
              filename: `${ticket.ticketNumber}.pdf`,
              buffer: pdfBuffer
            });

          await this.ticketsV1Service.updatePdf(
            ticket.id,
            pdfPath
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