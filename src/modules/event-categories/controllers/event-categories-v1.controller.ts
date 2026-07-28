import { EventCategoriesCreateV1Request } from './../dtos/requests/event-categories-create-v1.request';
import { IPaginationData } from '../../../shared/interfaces/paginate-response.interface';
import { EventCategoriesPaginateV1Request } from '../dtos/requests/event-categories-paginate-v1.request';
import { eventCategoriesUpdateV1Request } from '../dtos/requests/event-categories-update-v1.request';
import { EventCategoriesV1Response } from '../dtos/responses/event-categories-v1.response';
import { EventCategoriesV1Service } from './../services/event-categories-v1.service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../../../shared/decorators/public.decorator';
import { Roles } from '../../../shared/decorators/role.decorator';
import { RoleEnum } from '../../../shared/enums/role.enum';

@ApiTags('Event Categories')
@Controller({ path: "event-categories", version: "1" })
export class EventCategoriesV1Controller {
  constructor(
    private readonly eventCategoriesV1Service: EventCategoriesV1Service
  ) { }

  // ================================================
  //                    PUBLIC
  //=================================================
  @Public()
  @Get('')
  async getAllEventCategories(
    @Query() paginationDto: EventCategoriesPaginateV1Request
  ): Promise<IPaginationData<EventCategoriesV1Response>> {
    const result = await this.eventCategoriesV1Service.paginate(paginationDto)

    return {
      meta: result.meta,
      items: EventCategoriesV1Response.MapEntities(result.items)
    }
  }

  @Public()
  @Get(':categoryId')
  async getEventCategoriesById(
    @Param('categoryId') categoryId: string
  ): Promise<EventCategoriesV1Response> {
    const data = await this.eventCategoriesV1Service.findOneById(categoryId)

    return EventCategoriesV1Response.MapEntity(data)
  }

  // ================================================
  //                    ADMIN
  //=================================================
  @Roles(RoleEnum.ADMIN)
  @Post('')
  async createEventCategories(
    @Body() dataCategory: EventCategoriesCreateV1Request
  ): Promise<EventCategoriesV1Response> {
    const result = await this.eventCategoriesV1Service.createCategory(dataCategory)

    return EventCategoriesV1Response.MapEntity(result)
  }

  @Roles(RoleEnum.ADMIN)
  @Patch(':categoryId')
  async updateEventCategoriesById(
    @Param('categoryId') categoryId: string,
    @Body() dataCategory: eventCategoriesUpdateV1Request
  ): Promise<EventCategoriesV1Response> {
    const data = await this.eventCategoriesV1Service.updateById(categoryId, dataCategory)

    return EventCategoriesV1Response.MapEntity(data)
  }

  @Roles(RoleEnum.ADMIN)
  @Delete(':categoryId')
  async deleteEventCategoriesById(
    @Param('categoryId') categoryId: string
  ): Promise<EventCategoriesV1Response | null> {
    await this.eventCategoriesV1Service.softDeleteById(categoryId)

    return null
  }
}
