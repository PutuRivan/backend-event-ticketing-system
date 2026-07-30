import { Module } from '@nestjs/common';
import { ThrottlerModule, seconds } from '@nestjs/throttler';
import { RedisThrottlerStorage } from './storages/redis-throttler.storage';
import { config } from '../../../config';

@Module({
    imports: [
        ThrottlerModule.forRootAsync({
            useFactory: () => {
                const storage = new RedisThrottlerStorage();
                return {
                    throttlers: [
                        {
                            name: 'default',
                            ttl: seconds(config.throttle.ttlInSeconds),
                            limit: config.throttle.limit,
                        },
                    ],
                    storage,
                };
            },
        }),
    ],
    providers: [RedisThrottlerStorage],
    exports: [RedisThrottlerStorage],
})
export class ThrottleModule {}
