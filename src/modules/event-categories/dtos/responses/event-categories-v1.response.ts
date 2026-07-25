import { IEventCategories } from "../../../../infrastructures/databases/interfaces/event-categories.interface";
import { IEvent } from "../../../../infrastructures/databases/interfaces/event.interface";

export class EventCategoriesV1Response {
  id: string
  name: string
  description: string
  events?: IEvent[]

  constructor(entity: IEventCategories) {
    this.id = entity.id
    this.name = entity.name
    this.description = entity.description
    this.events = entity.events
  }

  static MapEntity(entity: IEventCategories): EventCategoriesV1Response {
    return new EventCategoriesV1Response(entity)
  }

  static MapEntities(entities: IEventCategories[]): EventCategoriesV1Response[] {
    return entities.map((item) => new EventCategoriesV1Response(item))
  }
}