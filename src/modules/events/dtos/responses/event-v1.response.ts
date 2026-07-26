import { IEventCategories } from "../../../../infrastructures/databases/interfaces/event-categories.interface";
import { IEvent } from "../../../../infrastructures/databases/interfaces/event.interface";
import { IOrder } from "../../../../infrastructures/databases/interfaces/order.interface";

export class EventV1Response {
  id: string
  title: string
  description: string
  category: IEventCategories;
  location: string
  eventDate: Date
  ticketPrice: number
  quota: number
  published: boolean
  orders: IOrder[];

  categoryId: string
  constructor(entity: IEvent) {
    this.id = entity.id
    this.title = entity.title
    this.description = entity.description
    this.category = entity.category
    this.location = entity.location
    this.eventDate = entity.eventDate
    this.ticketPrice = entity.ticketPrice
    this.quota = entity.quota
    this.published = entity.published
    this.orders = entity.orders

    this.categoryId = entity.categoryId
  }

  static MapEntity(entity: IEvent): EventV1Response {
    return new EventV1Response(entity)
  }

  static MapEntities(entities: IEvent[]): EventV1Response[] {
    return entities.map((item) => new EventV1Response(item))
  }
}