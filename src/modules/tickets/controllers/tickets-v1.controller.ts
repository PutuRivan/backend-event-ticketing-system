import { TicketsV1Service } from './../services/tickets-v1.service';
import { Body, Controller, Get, Param, Query, StreamableFile } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiParam, ApiProduces, ApiResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthTypeEnum } from '../../../infrastructures/modules/jwt/enums/jwt-type.enum';
import { TicketPaginateV1Request } from '../dtos/requests/tickets-paginate-v1.request';
import { IPaginateData } from '../../../shared/interfaces/paginate-response.interface';
import { TicketV1Response } from '../dtos/responses/tickets-v1.response';
import { Roles } from '../../../shared/decorators/role.decorator';
import { RoleEnum } from '../../../shared/enums/role.enum';

@ApiTags("Tickets")
@ApiBearerAuth(JwtAuthTypeEnum.AccessToken)
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
  @ApiOperation({ summary: 'Get all tickets (Admin)' })
  @ApiResponse({ status: 200 })
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
  @ApiOperation({ summary: 'Get ticket by ID' })
  @ApiResponse({ status: 200 })
  @ApiParam({ name: 'ticketId', description: 'Ticket ID' })
  async getTicket(
    @Param('ticketId') ticketId: string
  ): Promise<TicketV1Response> {
    const data = await this.ticketsV1Service.findOneByID(ticketId)

    return TicketV1Response.MapEntity(data)
  }

  @Get(':ticketId/download')
  @ApiOperation({ summary: 'Download ticket as PDF' })
  @ApiResponse({ status: 200, description: 'PDF file of the ticket' })
  @ApiParam({ name: 'ticketId', description: 'Ticket ID' })
  @ApiProduces('application/pdf')
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