import { IOrder } from "../../../../infrastructures/databases/interfaces/order.interface";
import { IUser } from "../../../../infrastructures/databases/interfaces/user.interface";
import { RoleEnum } from "../../../../shared/enums/role.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UserV1Response {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    email: string;

    @ApiPropertyOptional()
    roles?: RoleEnum;
    @ApiProperty()
    orders: IOrder[]

    constructor(entity: IUser) {
        this.id = entity.id;
        this.name = entity.name;
        this.email = entity.email;
        this.roles = entity.role
        this.orders = entity.orders
    }

    static MapEntity(entity: IUser): UserV1Response {
        return new UserV1Response(entity);
    }

    static MapEntities(entities: IUser[]): UserV1Response[] {
        return entities.map((item) => new UserV1Response(item));
    }
}
