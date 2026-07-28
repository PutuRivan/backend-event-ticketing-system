export interface ICreateOrder {
  userId: string;
  eventId: string;
  quantity: number;
  totalPrice: number;
  expiredAt: Date;
}