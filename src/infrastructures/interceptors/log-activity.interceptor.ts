import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import {
    QueueLogActivityJob,
    QueueName,
} from '../modules/queue/constants/queue.constant';
import { LogActivityCreateDto } from '../modules/queue/dtos/log-activity/log-activity-create.dto';
import { IQueueService } from '../modules/queue/interfaces/queue-service.interface';
import { QueueFactoryService } from '../modules/queue/services/queue-factory.service';
import { LogActivityV1Service } from '../../modules/log-activity/services/log-activity-v1.service';
import { Resource } from '../../shared/constants/resource.constant';
import { HttpMethod } from '../../shared/constants/http-method.constant';

@Injectable()
export class LogActivityInterceptor implements NestInterceptor {
    private queueLogActivityQueue: IQueueService;

    constructor(
        private readonly logActivityService: LogActivityV1Service,
        private readonly queueFactoryService: QueueFactoryService,
    ) {
        this.queueLogActivityQueue =
            this.queueFactoryService.createQueueService(QueueName.LogActivity);
    }

    private readonly logger = new Logger(LogActivityInterceptor.name);

    private readonly loggableMethods = Object.values(HttpMethod) as string[];

    /**
     * Map of application routes to their corresponding resources
     * Add your routes and resources here
     */
    private readonly resourceRoutes: Record<string, string> = {
        users: Resource.User,
        roles: Resource.Role,
        permissions: Resource.Permission,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'log-activities': Resource.LogActivity,
        orders: Resource.Orders

        /**
         * Add your route to resource mapping here
         */
    } as const;

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest<Request>();

        const { method, url, body, ip } = request;
        const user = request.user;

        this.logger.log(`Incoming request: ${method} ${url}`);

        return next.handle().pipe(
            tap({
                next: async (_) => {
                    // Validate if the request should be logged
                    const isLoggableRequest = this.isLoggableRequest(
                        method,
                        url,
                    );

                    if (!isLoggableRequest) {
                        this.logger.log(
                            `Request not loggable: ${method} ${url}, skipping logging.`,
                        );
                        return;
                    }

                    this.logger.log(`Logging request: ${method} ${url}`);

                    // Implement the actual logging logic here, e.g., save to database
                    const path = this.extractPathSegmentFromUrl(url);
                    if (!path) {
                        return;
                    }

                    // match resource with resource route mapping values
                    const resource = this.resourceRoutes[path];

                    const metaData = this.logActivityService.hideSensitiveData({
                        ...body,
                    });

                    // Send log activity to the queue processor
                    await this.queueLogActivityQueue.sendToQueue<LogActivityCreateDto>(
                        {
                            userId: user ? user['id'] : undefined,
                            source: user ? user['id'].toString() : 'system',
                            activity: '', // TODO: Define activity based on your requirements
                            menu: resource,
                            path: url,
                            metaData: metaData || null,
                            ip: ip,
                        },
                        QueueLogActivityJob.LogActivityCreate,
                    );
                },
                error: (error) => {
                    this.logger.error(
                        `Error processing request: ${method} ${url} - ${error.message}`,
                        error.stack,
                    );
                },
            }),
        );
    }

    private isLoggableRequest(method: string, url: string): boolean {
        // Check if the HTTP method is loggable
        if (!this.loggableMethods.includes(method)) {
            return false;
        }

        // Clean up the URL by removing query parameters
        url = this.cleanupQueryParams(url);

        // BaseURL value /api/v1/.../.../...
        const path = this.extractPathSegmentFromUrl(url);
        if (!path) {
            return false;
        }

        // match resource with resource route mapping values
        const resource = this.resourceRoutes[path];
        const isValidResource = !!resource;

        // Find the resource in ResourceRoutes
        if (!isValidResource) {
            return false;
        }

        return true;
    }

    private extractPathSegmentFromUrl(baseUrl: string): string | null {
        // remove /api/v1/ from baseUrl
        const cleanedBaseUrl = baseUrl.replace(/\/api\/v\d+\//, '');
        const pathSegments = cleanedBaseUrl.split('/');

        // Check if the first segment is a valid resource
        const resource = pathSegments[0];

        return resource || null;
    }

    private cleanupQueryParams(url: string): string {
        return url.split('?')[0];
    }
}
