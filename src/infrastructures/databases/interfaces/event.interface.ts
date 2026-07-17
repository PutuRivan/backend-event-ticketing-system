import { IOrder } from './order.interface';
import { IBaseEntity } from "./base-entity.interface";
import { IEventCategories } from './event-categories.interface';

export interface IEvent extends IBaseEntity {
  categoryId: string
  title: string
  description: string
  category: IEventCategories;
  location: string
  eventDate: Date
  ticketPrice: number
  quota: number
  published: boolean
  orders: IOrder[];
}