export interface IPdfCreateDto {
  ticketNumber: string;
  eventName: string;
  userName: string;
  eventDate: Date;
  location: string;
  qrCode: Buffer;
}