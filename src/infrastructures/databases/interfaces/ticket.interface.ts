import { IBaseEntity } from "./base-entity.interface";
import { IOrder } from "./order.interface";

export interface ITicket extends IBaseEntity {
  orderId: string
  ticketNumber: string
  qrCodePath: string
  pdfPath: string
  order: IOrder
}