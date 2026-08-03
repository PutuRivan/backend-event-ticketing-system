import { IOrder } from "../../../../infrastructures/databases/interfaces/order.interface";
import { ITicket } from "../../../../infrastructures/databases/interfaces/ticket.interface";
import { OrderV1Response } from "../../../orders/dtos/responses/orders-v1.response";
import { ApiProperty } from "@nestjs/swagger";

export class TicketV1Response {
  @ApiProperty()
  id: string
  @ApiProperty()
  ticketNumber: string
  @ApiProperty()
  qrCodePath: string
  @ApiProperty()
  pdfPath: string
  @ApiProperty()
  order: OrderV1Response

  constructor(entity: ITicket) {
    this.id = entity.id
    this.ticketNumber = entity.ticketNumber
    this.qrCodePath = entity.qrCodePath
    this.pdfPath = entity.pdfPath
    this.order = OrderV1Response.MapEntity(entity.order)
  }

  static MapEntity(entity: ITicket): TicketV1Response {
    return new TicketV1Response(entity)
  }

  static MapEntities(entities: ITicket[]): TicketV1Response[] {
    return entities.map((item) => new TicketV1Response(item))
  }
}