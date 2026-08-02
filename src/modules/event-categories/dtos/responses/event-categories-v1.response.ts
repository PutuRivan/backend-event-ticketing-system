import { EventV1Response } from './../../../events/dtos/responses/event-v1.response';
import { IEventCategories } from "../../../../infrastructures/databases/interfaces/event-categories.interface";
import { IEvent } from "../../../../infrastructures/databases/interfaces/event.interface";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class EventCategoriesV1Response {
  @ApiProperty()
  id: string
  @ApiProperty()
  name: string
  @ApiProperty()
  description: string
  @ApiPropertyOptional({ type: () => [EventV1Response] })
  events?: EventV1Response[]

  constructor(entity: IEventCategories) {
    this.id = entity.id
    this.name = entity.name
    this.description = entity.description
    this.events = EventV1Response.MapEntities(entity.events)
  }

  static MapEntity(entity: IEventCategories): EventCategoriesV1Response {
    return new EventCategoriesV1Response(entity)
  }

  static MapEntities(entities: IEventCategories[]): EventCategoriesV1Response[] {
    return entities.map((item) => new EventCategoriesV1Response(item))
  }
}