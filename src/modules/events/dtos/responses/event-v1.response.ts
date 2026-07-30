import { IEventCategories } from "../../../../infrastructures/databases/interfaces/event-categories.interface";
import { IEvent } from "../../../../infrastructures/databases/interfaces/event.interface";
import { IOrder } from "../../../../infrastructures/databases/interfaces/order.interface";
import { EventCategoriesV1Response } from "../../../event-categories/dtos/responses/event-categories-v1.response";
import { OrderV1Response } from "../../../orders/dtos/responses/orders-v1.response";

export class EventV1Response {
  id: string
  title: string
  description: string
  category: EventCategoriesV1Response;
  location: string
  eventDate: Date
  ticketPrice: number
  quota: number
  published: boolean
  orders: OrderV1Response[];

  constructor(entity: IEvent) {
    this.id = entity.id
    this.title = entity.title
    this.description = entity.description
    this.category = EventCategoriesV1Response.MapEntity(entity.category)
    this.location = entity.location
    this.eventDate = entity.eventDate
    this.ticketPrice = entity.ticketPrice
    this.quota = entity.quota
    this.published = entity.published
    this.orders = OrderV1Response.MapEntities(entity.orders)
  }

  static MapEntity(entity: IEvent): EventV1Response {
    return new EventV1Response(entity)
  }

  static MapEntities(entities: IEvent[]): EventV1Response[] {
    return entities.map((item) => new EventV1Response(item))
  }
}