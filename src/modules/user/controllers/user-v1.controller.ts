import { UserV1Response } from '../dtos/responses/user-v1.response';
import { UserV1Service } from '../services/user-v1.service';
import { UserPaginateV1Request } from './../dtos/requests/user-paginate-v1.request';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { UserUpdateV1Request } from '../dtos/requests/user-update-v1.request';
import { IPaginationData } from '../../../shared/interfaces/paginate-response.interface';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthTypeEnum } from '../../../infrastructures/modules/jwt/enums/jwt-type.enum';
import { Roles } from '../../../shared/decorators/role.decorator';
import { RoleEnum } from '../../../shared/enums/role.enum';

@ApiTags('User')
@ApiBearerAuth(JwtAuthTypeEnum.AccessToken)
@Controller({ path: 'users', version: '1' })
export class UserV1Controller {
  constructor(private readonly userV1Service: UserV1Service) { }

  // ================================================
  //                    ADMIN
  //=================================================
  @Roles(RoleEnum.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all users (Admin)' })
  @ApiResponse({ status: 200 })
  async getAllUsers(
    @Query() paginationDto: UserPaginateV1Request
  ): Promise<IPaginationData<UserV1Response>> {
    const result = await this.userV1Service.paginate(paginationDto)

    return {
      meta: result.meta,
      items: UserV1Response.MapEntities(result.items),
    };
  }

  @Roles(RoleEnum.ADMIN)
  @Get(':userId')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200 })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async getById(
    @Param('userId') userId: string
  ): Promise<UserV1Response> {
    const data = await this.userV1Service.findOneById(userId)

    return UserV1Response.MapEntity(data)
  }

  @Roles(RoleEnum.ADMIN)
  @Patch(':userId')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiResponse({ status: 200 })
  @ApiParam({ name: 'userId', description: 'User ID' })
  async updateById(
    @Param('userId') userId: string,
    @Body() dataUser: UserUpdateV1Request
  ): Promise<UserV1Response> {
    const data = await this.userV1Service.updateById(userId, dataUser);

    return UserV1Response.MapEntity(data);
  }

  @Roles(RoleEnum.ADMIN)
  @Delete(':userId')
  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteById(
    @Param('userId') userId: string
  ): Promise<UserV1Response | null> {
    await this.userV1Service.softDeleteById(userId);

    return null;
  }
}
