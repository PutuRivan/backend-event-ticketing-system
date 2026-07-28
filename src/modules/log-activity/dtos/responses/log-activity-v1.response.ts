import { ILogActivity } from "../../../../infrastructures/databases/interfaces/log-activity.interface";
import { UserV1Response } from "../../../user/dtos/responses/user-v1.response";

export class LogActivityV1Response {
    id: string;
    user: UserV1Response | null;
    source: string;
    metaData: any;
    activity: string;
    menu: string;
    path: string;
    ip: string;

    constructor(entity: ILogActivity) {
        this.id = entity.id;
        this.user = entity.user ? UserV1Response.MapEntity(entity.user) : null;
        this.source = entity.source || '-';
        this.metaData = entity.metaData;
        this.activity = entity.activity;
        this.menu = entity.menu || '-';
        this.path = entity.path || '-';
        this.ip = entity.ip || '-';
    }

    static MapEntity(entity: ILogActivity): LogActivityV1Response {
        return new LogActivityV1Response(entity);
    }

    static MapEntities(entities: ILogActivity[]): LogActivityV1Response[] {
        return entities.map((item) => new LogActivityV1Response(item));
    }
}
