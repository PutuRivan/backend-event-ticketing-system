import { Body, Controller, Get, Patch } from "@nestjs/common";
import { Roles } from "../../../shared/decorators/role.decorator";
import { RoleEnum } from "../../../shared/enums/role.enum";
import { UserV1Service } from "../services/user-v1.service";
import { CurrentUser } from "../../../shared/decorators/current-user.decorator";
import type { IUser } from "../../../infrastructures/databases/interfaces/user.interface";
import { UserV1Response } from "../dtos/responses/user-v1.response";
import { UserUpdateV1Request } from "../dtos/requests/user-update-v1.request";
import { ApiTags } from "@nestjs/swagger";
import { UserProfileUpdateV1Request } from "../dtos/requests/user-profile-update-v1.request";

@ApiTags('Profile')
@Controller({ path: 'profile', version: '1' })
export class UserProfileV1Controller {
  constructor(private readonly userV1Service: UserV1Service) { }

  @Roles(RoleEnum.USER)
  @Get('')
  async getProfile(
    @CurrentUser() user: IUser,
  ): Promise<UserV1Response> {
    const data = await this.userV1Service.findOneById(user.id);

    return UserV1Response.MapEntity(data);
  }

  @Roles(RoleEnum.USER)
  @Patch('')
  async updateProfile(
    @CurrentUser() user: IUser,
    @Body() dto: UserProfileUpdateV1Request,
  ): Promise<UserV1Response> {
    const data = await this.userV1Service.updateProfile(user.id, dto);

    return UserV1Response.MapEntity(data);
  }
}