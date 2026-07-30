import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-ioredis-yet';
import { config } from '../../../config';
import { HttpCacheInterceptor } from './interceptors/http-cache.interceptor';

@Module({
    imports: [
        NestCacheModule.registerAsync({
            useFactory: async () => ({
                store: await redisStore({
                    host: config.redis.host,
                    port: config.redis.port,
                    ttl: config.cache.ttl,
                    enableReadyCheck: true,
                    maxRetriesPerRequest: null,
                    prefix: `${config.app.name}:${config.nodeEnv}:cache`,
                    lazyConnect: true,
                }),
            }),
            isGlobal: true,
        }),
    ],
    providers: [HttpCacheInterceptor],
    exports: [HttpCacheInterceptor],
})
export class CacheModule { }
