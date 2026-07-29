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

@Injectable()
export class TicketsV1Service {
  private queueTicketsService: IQueueService
  private storageService: IStorageService;

  constructor(
    private readonly ticketV1Repository: TicketsV1Repository,
    private readonly queueFactoryService: QueueFactoryService,
    private readonly storageFactoryService: StorageFactoryService
  ) {
    this.queueTicketsService = this.queueFactoryService.createQueueService(
      QueueName.Tickets
    )

    this.storageService =
      this.storageFactoryService.createStorageService(
        StorageDriver.Local
      );
  }

  private generateTicketNumber() {
    return `TKT-${randomUUID()
      .slice(0, 8)
      .toUpperCase()}`;
  }


  async generateQRCode(ticketNumber: string) {

    const buffer =
      await QRCode.toBuffer(
        ticketNumber
      );


    return this.storageService.uploadToStorage({
      folder: "qrcode",
      filename: `${ticketNumber}.png`,
      buffer
    });
  }

  async paginate(
    paginationDTO: TicketPaginateV1Request
  ): Promise<IPaginateData<ITicket>> {
    return this.ticketV1Repository.paginate(paginationDTO)
  }

  async findOneByID(id: string): Promise<ITicket> {
    return await this.ticketV1Repository.findOneById(id)
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