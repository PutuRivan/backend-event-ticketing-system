import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Orders } from "./orders.entity";
import { BaseEntity } from "./base.entity";
import { ITicket } from "../interfaces/ticket.interface";

@Index("tickets_pkey", ["id"], { unique: true })
@Index("idx_tickets_order", ["orderId"], {})
@Index("tickets_ticket_number_key", ["ticketNumber"], { unique: true })
@Entity("tickets", { schema: "public" })
export class Tickets extends BaseEntity implements ITicket {
  @Column()
  orderId!: string;

  @ManyToOne(() => Orders, (order) => order.tickets)
  @JoinColumn({
    name: 'order_id',
  })
  order!: Orders;

  @Column({
    unique: true,
    length: 100,
  })
  ticketNumber!: string;

  @Column({
    nullable: true,
    length: 500,
  })
  qrCodePath!: string;

  @Column({
    nullable: true,
    length: 500,
  })
  pdfPath!: string;
}
