import { IOrder } from "../../../../infrastructures/databases/interfaces/order.interface";
import { ITicket } from "../../../../infrastructures/databases/interfaces/ticket.interface";

export class TicketV1Response {
  orderId: string
  ticketNumber: string
  qrCodePath: string
  pdfPath: string
  order: IOrder

  constructor(entity: ITicket) {
    this.orderId = entity.orderId
    this.ticketNumber = entity.ticketNumber
    this.qrCodePath = entity.qrCodePath
    this.pdfPath = entity.pdfPath
    this.order = entity.order
  }

  static MapEntity(entity: ITicket): TicketV1Response {
    return new TicketV1Response(entity)
  }

  static MapEntities(entities: ITicket[]): TicketV1Response[] {
    return entities.map((item) => new TicketV1Response(item))
  }
}