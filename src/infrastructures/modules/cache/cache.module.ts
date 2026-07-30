import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-ioredis-yet';
import { config } from '../../../config';
import { HttpCacheInterceptor } from './interceptors/http-cache.interceptor';
import { CacheService } from './services/cache.service';
import { Keyv } from 'keyv';
import KeyvRedis from '@keyv/redis';
import { CacheInvalidateInterceptor } from './interceptors/cache-invalidate.interceptor';

@Module({
    imports: [
        NestCacheModule.register({
            stores: [
                new Keyv({
                    store: new KeyvRedis(
                        `redis://${config.redis.host
                        }:${config.redis.port}`
                    ),
                    ttl: config.cache.ttl,
                }),
            ],
            isGlobal: true,
        }),
    ],
    providers: [
        HttpCacheInterceptor,
        CacheInvalidateInterceptor,
        CacheService
    ],
    exports: [
        HttpCacheInterceptor,
        CacheInvalidateInterceptor,
        CacheService
    ],
})
export class CacheModule { }
