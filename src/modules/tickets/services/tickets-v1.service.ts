import { Injectable } from "@nestjs/common";
import { TicketsV1Repository } from "../repositories/tickets-v1.repository";
import QRCode from "qrcode";
import { randomUUID } from "crypto";
import { QueueName, QueueTicketJob } from "../../../infrastructures/modules/queue/constants/queue.constant";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { IQueueService } from "../../../infrastructures/modules/queue/interfaces/queue-service.interface";
import { QueueFactoryService } from "../../../infrastructures/modules/queue/services/queue-factory.service";
import { StorageLocalService } from "../../../infrastructures/modules/storage/services/storage-local.service";
import { IStorageService } from "../../../infrastructures/modules/storage/interfaces/storage.interface";
import { StorageDriver } from "../../../infrastructures/modules/storage/constant/storage.constant";
import { StorageFactoryService } from "../../../infrastructures/modules/storage/services/storage-factory.service";
import { TicketPaginateV1Request } from "../dtos/requests/tickets-paginate-v1.request";
import { IPaginateData } from "../../../shared/interfaces/paginate-response.interface";
import { TicketV1Response } from "../dtos/responses/tickets-v1.response";
import { ITicket } from "../../../infrastructures/databases/interfaces/ticket.interface";
import { QrCodeService } from "../../../infrastructures/modules/qr/services/qr-code.service";

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

  async paginate(
    paginationDTO: TicketPaginateV1Request
  ): Promise<IPaginateData<ITicket>> {
    return this.ticketV1Repository.paginate(paginationDTO)
  }

  async findOneByID(id: string): Promise<ITicket> {
    return await this.ticketV1Repository.findOneOrFail({
      where: {
        id
      },
      relations: {
        order: {
          user: true,
          event: true
        }
      }
    });
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

  async updatePdf(
    ticketId: string,
    pdfPath: string
  ) {

    return await this.ticketV1Repository.update(
      ticketId,
      {
        pdfPath: pdfPath
      }
    );
  }
}