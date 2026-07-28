import { Injectable } from "@nestjs/common";
import { TicketsV1Repository } from "../repositories/tickets-v1.repository";
import QRCode from "qrcode";
import { randomUUID } from "crypto";
import { QueueName, QueueTicketJob } from "../../../infrastructures/modules/queue/constants/queue.constant";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { IQueueService } from "../../../infrastructures/modules/queue/interfaces/queue-service.interface";
import { QueueFactoryService } from "../../../infrastructures/modules/queue/services/queue-factory.service";

@Injectable()
export class TicketsV1Service {
  private queueTicketsService: IQueueService

  constructor(
    private readonly ticketV1Repository: TicketsV1Repository,
    private readonly queueFactoryService: QueueFactoryService,
  ) {
    this.queueTicketsService = this.queueFactoryService.createQueueService(
      QueueName.Tickets
    )
  }

  private generateTicketNumber() {
    return `TKT-${randomUUID()
      .slice(0, 8)
      .toUpperCase()}`;
  }


  async generateQRCode(ticketNumber: string) {

    const path = `storage/qrcode/${ticketNumber}.png`;

    await QRCode.toFile(
      path,
      ticketNumber
    );

    return path;
  }

  async createTicket(orderId: string) {

    const ticketNumber = this.generateTicketNumber();


    const entity =
      this.ticketV1Repository.create({
        orderId,
        ticketNumber,
      });

    const ticket = await this.ticketV1Repository.save(entity);

    await this.queueTicketsService.sendToQueue(
      {
        ticketId: ticket.id,
        ticketNumber: ticket.ticketNumber
      },
      QueueTicketJob.GenerateQrCode
    )

    return ticket
  }


  async updateQRCode(
    ticketId: string,
    qrPath: string
  ) {

    await this.ticketV1Repository.update(
      ticketId,
      {
        qrCodePath: qrPath
      }
    );
  }
}