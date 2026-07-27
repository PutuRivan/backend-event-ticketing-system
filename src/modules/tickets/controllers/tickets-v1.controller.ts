import { TicketsV1Service } from './../services/tickets-v1.service';
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Tickets")
@Controller({ path: 'tickets', version: '1' })
export class TicketsV1Controller {
  constructor(
    private readonly TicketsV1Service: TicketsV1Service
  ) { }

  @Get('')
  async getAllTickets() { }

  @Get(':ticketId')
  async getTicket() { }

  @Get(':ticketId/download')
  async downloadTicket() { }
}