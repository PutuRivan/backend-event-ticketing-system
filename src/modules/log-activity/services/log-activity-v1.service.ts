import { Injectable, Logger } from "@nestjs/common";
import { LogActivityV1Repository } from "../repositories/log-activity-v1.repository";
import { LogActivityPaginateV1Request } from "../dtos/requests/log-activity-paginate-v1.request";
import { ILogActivity } from "../../../infrastructures/databases/interfaces/log-activity.interface";
import { LogActivityCreateDto } from "../../../infrastructures/modules/queue/dtos/log-activity/log-activity-create.dto";

@Injectable()
export class LogActivityV1Service {
  constructor(
    private readonly logActivityRepository: LogActivityV1Repository,
  ) { }

  private readonly logger = new Logger(LogActivityV1Service.name)

  async paginate(
    paginationDto: LogActivityPaginateV1Request,
  ) {
    return this.logActivityRepository.paginate(paginationDto);
  }

  async findOneById(id: string): Promise<ILogActivity> {
    return this.logActivityRepository.findOneOrFail({
      where: { id },
      relations: ['user'],
    });
  }

  hideSensitiveData(metaData: any): any {
    switch (true) {
      case !!metaData['password']:
        metaData['password'] = 'HIDDEN';
        break;
      case !!metaData['confirmPassword']:
        metaData['confirmPassword'] = 'HIDDEN';
        break;
      case !!metaData['oldPassword']:
        metaData['oldPassword'] = 'HIDDEN';
        break;
      case !!metaData['newPassword']:
        metaData['newPassword'] = 'HIDDEN';
        break;
      case !!metaData['otpCode']:
        metaData['otpCode'] = 'HIDDEN';
        break;
    }

    return metaData;
  }

  async queueLogActivityCreate(data: LogActivityCreateDto): Promise<void> {
    try {
      // Save log activity to the database
      const createData = this.logActivityRepository.create({
        userId: data.userId,
        source: data.source,
        activity: data.activity, // TODO: Define activity based on your requirements
        menu: data.menu,
        path: data.path,
        metaData: data.metaData,
        ip: data.ip,
      });
      await this.logActivityRepository.save(createData);

      this.logger.log(
        `Log activity created for userId: ${data.userId}, activity: ${data.activity}`,
      );
    } catch (error: any) {
      this.logger.error(
        `Failed to create log activity: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}