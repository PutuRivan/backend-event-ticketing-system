import { IBaseEntity } from "./base-entity.interface";
import { IEvent } from "./event.interface";

export interface IEventCategories extends IBaseEntity {
  name: string
  description: string
  events: IEvent[]
}