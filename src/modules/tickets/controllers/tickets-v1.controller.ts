import { TicketsV1Service } from './../services/tickets-v1.service';
import { Body, Controller, Get, Param, Query, StreamableFile } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TicketPaginateV1Request } from '../dtos/requests/tickets-paginate-v1.request';
import { IPaginateData } from '../../../shared/interfaces/paginate-response.interface';
import { TicketV1Response } from '../dtos/responses/tickets-v1.response';
import { Roles } from '../../../shared/decorators/role.decorator';
import { RoleEnum } from '../../../shared/enums/role.enum';

@ApiTags("Tickets")
@Controller({ path: 'tickets', version: '1' })
export class TicketsV1Controller {
  constructor(
    private readonly ticketsV1Service: TicketsV1Service
  ) { }

  // ================================================
  //                    ADMIN
  //=================================================
  @Get('')
  @Roles(RoleEnum.ADMIN)
  async getAllTickets(
    @Query() paginationDto: TicketPaginateV1Request
  ): Promise<IPaginateData<TicketV1Response>> {
    const result = await this.ticketsV1Service.paginate(paginationDto)

    return {
      meta: result.meta,
      items: TicketV1Response.MapEntities(result.items)
    }
  }

  @Get(':ticketId')
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  async getTicket(
    @Param('ticketId') ticketId: string
  ): Promise<TicketV1Response> {
    const data = await this.ticketsV1Service.findOneByID(ticketId)

    return TicketV1Response.MapEntity(data)
  }

  @Get(':ticketId/download')
  async downloadTicket(
    @Param('ticketId') ticketId: string
  ): Promise<StreamableFile> {
    const result = await this.ticketsV1Service.downloadTicket(ticketId)

    return new StreamableFile(result.buffer, {
      type: 'application/pdf',
      disposition: `attachment; filename="${result.filename}"`,
    });
  }
}