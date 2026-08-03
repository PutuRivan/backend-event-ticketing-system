import { DataSource, QueryFailedError } from 'typeorm';
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UserPaginateV1Request } from "../dtos/requests/user-paginate-v1.request";
import { UserV1Repository } from '../repositories/user-v1.repository';
import { IUser } from '../../../infrastructures/databases/interfaces/user.interface';
import { UserUpdateV1Request } from '../dtos/requests/user-update-v1.request';
import { UserProfileUpdateV1Request } from '../dtos/requests/user-profile-update-v1.request';

@Injectable()
export class UserV1Service {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userV1Repository: UserV1Repository
  ) { }
  async paginate(paginationDto: UserPaginateV1Request) {
    return await this.userV1Repository.paginate(paginationDto)
  }

  async findOneById(id: string): Promise<IUser> {
    const user = await this.userV1Repository.findOneById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateById(
    id: string,
    dataUpdate: UserUpdateV1Request,
  ): Promise<IUser> {

    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const payload = Object.fromEntries(
      Object.entries({
        name: dataUpdate.name,
        email: dataUpdate.email,
        role: dataUpdate.role
      }).filter(([, v]) => v !== undefined),
    );

    const isUpdated = await this.userV1Repository.updateUser(id, payload)

    if (!isUpdated) {
      throw new BadRequestException("")
    }

    return this.findOneById(id)
  }

  async updateProfile(
    id: string,
    dataUpdate: UserProfileUpdateV1Request
  ): Promise<IUser> {
    const user = await this.findOneById(id);

    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const payload = Object.fromEntries(
      Object.entries({
        name: dataUpdate.name,
        email: dataUpdate.email,
      }).filter(([, v]) => v !== undefined),
    );

    const update = await this.userV1Repository.updateUser(id, payload)

    if (!update) {
      throw new BadRequestException("")
    }

    return this.findOneById(id)
  }

  async softDeleteById(id: string): Promise<Boolean> {
    const status = await this.userV1Repository.softDelete({ id })
    if (status.affected && status.affected < 1) {
      throw new QueryFailedError(
        'Error, Data not deleted',
        undefined,
        new Error(),
      );
    }

    return true;
  }
}