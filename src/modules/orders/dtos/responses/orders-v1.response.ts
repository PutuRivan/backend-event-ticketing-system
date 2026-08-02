import { IEvent } from "../../../../infrastructures/databases/interfaces/event.interface";
import { IOrder } from "../../../../infrastructures/databases/interfaces/order.interface";
import { ITicket } from "../../../../infrastructures/databases/interfaces/ticket.interface";
import { IUser } from "../../../../infrastructures/databases/interfaces/user.interface";
import { OrderStatusEnum } from "../../../../shared/enums/order-status.enum";
import { EventV1Response } from "../../../events/dtos/responses/event-v1.response";
import { TicketV1Response } from "../../../tickets/dtos/responses/tickets-v1.response";
import { UserV1Response } from "../../../user/dtos/responses/user-v1.response";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class OrderV1Response {
  @ApiProperty()
  totalPrice: number;
  @ApiProperty()
  status: OrderStatusEnum;
  @ApiPropertyOptional()
  expiredAt?: Date | null;
  @ApiPropertyOptional()
  paidAt?: Date | null;
  @ApiProperty()
  user: UserV1Response;
  @ApiProperty()
  event: EventV1Response
  @ApiProperty()
  tickets: TicketV1Response[];

  constructor(entity: IOrder) {
    this.user = UserV1Response.MapEntity(entity.user)
    this.event = EventV1Response.MapEntity(entity.event)
    this.totalPrice = entity.totalPrice
    this.status = entity.status
    this.expiredAt = entity.expiredAt
    this.paidAt = entity.paidAt
    this.tickets = TicketV1Response.MapEntities(entity.tickets)
  }

  static MapEntity(entity: IOrder): OrderV1Response {
    return new OrderV1Response(entity)
  }

  static MapEntities(entities: IOrder[]): OrderV1Response[] {
    return entities.map((item) => new OrderV1Response(item))
  }
}
