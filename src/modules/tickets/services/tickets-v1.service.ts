import { Injectable, NotFoundException, UnprocessableEntityException } from "@nestjs/common";
import { ErrorMessageConstant } from "../../../shared/constants/message.constant";
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
import { IsNull, Not, QueryRunner } from "typeorm";
import { Tickets } from "../../../infrastructures/databases/entities/tickets.entity";

@Injectable()
export class TicketsV1Service {
  private queueTicketsService: IQueueService
  private storageLocalService: IStorageService
  constructor(
    private readonly ticketV1Repository: TicketsV1Repository,
    private readonly queueFactoryService: QueueFactoryService,
    private readonly storageFactoryService: StorageFactoryService
  ) {
    this.queueTicketsService = this.queueFactoryService.createQueueService(
      QueueName.Tickets
    )

    this.storageLocalService = this.storageFactoryService.createStorageService(
      StorageDriver.Local
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
    const ticket = await this.ticketV1Repository.findOne({
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

    if (!ticket) {
      throw new NotFoundException(
        ErrorMessageConstant.DataEntityNotFound('Ticket'),
      );
    }

    return ticket;
  }

  async createTicket(
    orderId: string,
    queryRunner: QueryRunner,
  ): Promise<ITicket> {

    const ticketNumber =
      this.generateTicketNumber();


    const repo =
      queryRunner.manager.getRepository(
        Tickets,
      );


    const entity =
      repo.create({
        orderId,
        ticketNumber,
      });


    return await repo.save(entity);
  }

  async findByOrderId(
    orderId: string,
  ): Promise<ITicket[]> {

    return this.ticketV1Repository.findByOrderId(
      orderId,
    );

  }

  async isAllPdfGenerated(
    orderId: string
  ): Promise<boolean> {


    const total =
      await this.ticketV1Repository.count({
        where: {
          orderId
        }
      });


    const completed =
      await this.ticketV1Repository.count({
        where: {
          orderId,
          pdfPath: Not(IsNull())
        }
      });


    return total === completed;
  }

  async updateQRCode(
    ticketId: string,
    qrPath: string
  ): Promise<ITicket> {

    await this.ticketV1Repository.update(
      ticketId,
      {
        qrCodePath: qrPath
      }
    );

    const ticket = await this.ticketV1Repository.findOne({
      where: {
        id: ticketId,
      },
      relations: {
        order: {
          event: true,
          user: true,
        },
      },
    });

    if (!ticket) {
      throw new NotFoundException(
        ErrorMessageConstant.DataEntityNotFound('Ticket'),
      );
    }

    return ticket;
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

  async downloadTicket(ticketId: string) {
    const ticket =
      await this.findOneByID(ticketId);


    if (!ticket.pdfPath) {
      throw new UnprocessableEntityException(ErrorMessageConstant.FileNotFound);
    }


    const buffer =
      await this.storageLocalService.getFromStorage({
        path: ticket.pdfPath,
      });


    return {
      filename: `${ticket.ticketNumber}.pdf`,
      buffer,
    };
  }
}