import { OrderStatusEnum } from '../../../shared/enums/order-status.enum';
import { IBaseEntity } from './base-entity.interface';
import { IEvent } from './event.interface';
import { IReminders } from './reminders.interface';
import { ITicket } from './ticket.interface';
import { IUser } from './user.interface';


export interface IOrder extends IBaseEntity {
  userId: string;
  eventId: string;

  user: IUser;
  event: IEvent;

  totalPrice: number;
  quantity: number;

  status: OrderStatusEnum;

  ticketEmailSent: boolean;

  expiredAt: Date | null;
  paidAt: Date | null;

  tickets: ITicket[];
  reminders: IReminders[];
}