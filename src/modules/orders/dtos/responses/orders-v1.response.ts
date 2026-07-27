import { IOrder } from "../../../../infrastructures/databases/interfaces/order.interface";
import { ITicket } from "../../../../infrastructures/databases/interfaces/ticket.interface";
import { OrderStatusEnum } from "../../../../shared/enums/order-status.enum";

export class OrderV1Response {
  userId: string;
  eventId: string;
  totalPrice: number;
  status: OrderStatusEnum;
  expiredAt?: Date | null;
  paidAt?: Date | null;
  tickets: ITicket[];

  constructor(entity: IOrder) {
    this.userId = entity.userId
    this.eventId = entity.eventId
    this.totalPrice = entity.totalPrice
    this.status = entity.status
    this.expiredAt = entity.expiredAt
    this.paidAt = entity.paidAt
    this.tickets = entity.tickets
  }

  static MapEntity(entity: IOrder): OrderV1Response {
    return new OrderV1Response(entity)
  }

  static MapEntities(entities: IOrder[]): OrderV1Response[] {
    return entities.map((item) => new OrderV1Response(item))
  }
}
