import { Processor, WorkerHost } from "@nestjs/bullmq";
import { QueueMailJob, QueueName, QueueOrderJob, QueueTicketJob } from "../constants/queue.constant";
import { TicketsV1Service } from "../../../../modules/tickets/services/tickets-v1.service";
import { Job } from "bullmq";
import { QueueGenerateTicketService } from "../services/queue-generate-ticket.service";
import { PdfService } from "../../pdf/services/pdf.service";
import { QrCodeService } from "../../qr/services/qr-code.service";
import { StorageFactoryService } from "../../storage/services/storage-factory.service";
import { IStorageService } from "../../storage/interfaces/storage.interface";
import { StorageDriver } from "../../storage/constant/storage.constant";
import { QueueMailService } from "../services/queue-mail.service";
import { MailSendDto } from "../../mail/dto/mail-send.dto";
import { MailTemplateFileEnum } from "../../mail/enums/mail-template-file.enum";

@Processor(QueueName.Tickets)
export class QueueTicketProcessor extends WorkerHost {
  private storageService: IStorageService;
  constructor(
    private readonly ticketsV1Service: TicketsV1Service,
    private readonly queueTicketService: QueueGenerateTicketService,
    private readonly pdfService: PdfService,
    private readonly qrCodeService: QrCodeService,
    private readonly storageFactoryService: StorageFactoryService,
    private readonly queueMailService: QueueMailService

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

          const ticket =
            await this.ticketsV1Service.findOneByID(
              job.data.ticketId
            );

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

          await this.queueMailService.sendToQueue<MailSendDto>(
            {
              to: ticket.order.user.email,
              subject: 'Your Event Ticket',
              template: MailTemplateFileEnum.TicketCreated,
              context: {
                name: ticket.order.user.name,
                eventName: ticket.order.event.title,
                ticketNumber: ticket.ticketNumber,
                eventDate: ticket.order.event.eventDate,
                location: ticket.order.event.location,
                quantity: ticket.order.quantity
              },
              attachments: [
                {
                  filename: 'ticket.pdf',
                  path: pdfPath,
                }
              ],
            },
            QueueMailJob.MailSend,
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