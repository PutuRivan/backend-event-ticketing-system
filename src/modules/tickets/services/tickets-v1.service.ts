import { Injectable } from "@nestjs/common";
import { TicketsV1Repository } from "../repositories/tickets-v1.repository";
import QRCode from "qrcode";
import { randomUUID } from "crypto";

@Injectable()
export class TicketsV1Service {
  constructor(
    private readonly ticketV1Repository: TicketsV1Repository,
  ) { }

  private generateTicketNumber() {
    return `TKT-${randomUUID()
      .slice(0, 8)
      .toUpperCase()}`;
  }

  async generateQRCode(ticketNumber: string) {

    try {
      const path = `storage/qrcode/${ticketNumber}.png`;

      await QRCode.toFile(
        path,
        ticketNumber
      );

      return path;

    } catch (error) {
      console.log(error);
      throw error;
    }

  }

  async createTicket(orderId: string) {
    console.log("CREATE TICKET:", orderId);

    const ticketNumber = this.generateTicketNumber();

    const qrPath = await this.generateQRCode(ticketNumber);

    console.log("QR PATH:", qrPath);

    const ticket = this.ticketV1Repository.create({
      orderId,
      ticketNumber,
      qrCodePath: qrPath
    });


    return this.ticketV1Repository.save(ticket);
  }
}