import { IUser } from "../../../../infrastructures/databases/interfaces/user.interface";
import { RoleEnum } from "../../../../shared/enums/role.enum";

export class UserV1Response {
    id: string;
    name: string;
    email: string;

    roles?: RoleEnum;

    constructor(entity: IUser) {
        this.id = entity.id;
        this.name = entity.name;
        this.email = entity.email;
        this.roles = entity.role
    }

    static MapEntity(entity: IUser): UserV1Response {
        return new UserV1Response(entity);
    }

    static MapEntities(entities: IUser[]): UserV1Response[] {
        return entities.map((item) => new UserV1Response(item));
    }
}
