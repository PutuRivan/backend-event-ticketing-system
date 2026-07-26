import { Entity } from 'typeorm';
import { UserV1Response } from '../dtos/responses/user-v1.response';
import { UserV1Service } from '../services/user-v1.service';
import { UserPaginateV1Request } from './../dtos/requests/user-paginate-v1.request';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserUpdateV1Request } from '../dtos/requests/user-update-v1.request';
import { IPaginationData } from '../../../shared/interfaces/paginate-response.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller({ path: 'users', version: '1' })
export class UserV1Controller {
  constructor(private readonly userV1Service: UserV1Service) { }

  @Get()
  async getAllUsers(
    @Query() paginationDto: UserPaginateV1Request
  ): Promise<IPaginationData<UserV1Response>> {
    const result = await this.userV1Service.paginate(paginationDto)

    return {
      meta: result.meta,
      items: UserV1Response.MapEntities(result.items),
    };
  }

  @Get(':userId')
  async getById(
    @Param('userId') userId: string
  ): Promise<UserV1Response> {
    const data = await this.userV1Service.findOneById(userId)

    return UserV1Response.MapEntity(data)
  }

  @Patch(':userId')
  async updateById(
    @Param('userId') userId: string,
    @Body() dataUser: UserUpdateV1Request
  ): Promise<UserV1Response> {
    const data = await this.userV1Service.updateById(userId, dataUser);

    return UserV1Response.MapEntity(data);
  }

  @Delete(':userId')
  async deleteById(
    @Param('userId') userId: string
  ): Promise<UserV1Response | null> {
    await this.userV1Service.softDeleteById(userId);

    return null;
  }

}
