import { Repository } from "typeorm";
import { IUser } from "../../../infrastructures/databases/interfaces/user.interface";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Users } from "../../../infrastructures/databases/entities/users.entity";
import { UserPaginateV1Request } from "../dtos/requests/user-paginate-v1.request";
import { PaginationUtil } from "../../../shared/utils/pagination.util";

@Injectable()
export class UserV1Repository extends Repository<IUser> {
  constructor(
    @InjectRepository(Users)
    private readonly repo: Repository<IUser>,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async paginate(request: UserPaginateV1Request) {
    const query = this.createQueryBuilder()

    query.take(request.perPage);
    query.skip(PaginationUtil.countOffset(request));

    const [items, count] = await query.getManyAndCount();

    const meta = PaginationUtil.mapMeta(count, request);

    return {
      meta,
      items,
    };
  }

  async findOneById(id: string): Promise<IUser> {
    return await this.findOneOrFail({
      where: { id },
    })
  }

  async findOneByEmail(email: string): Promise<IUser | null> {
    return await this.findOne({ where: { email } });
  }


}