import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import type { Redis as IRedis } from 'ioredis';
import { config } from '../../../../config';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const Redis = require('ioredis');

interface IThrottlerStorageRecord {
    totalHits: number;
    timeToExpire: number;
    isBlocked: boolean;
    timeToBlockExpire: number;
}

@Injectable()
export class RedisThrottlerStorage
    implements ThrottlerStorage, OnModuleDestroy
{
    private readonly redis: IRedis;
    private readonly keyPrefix: string;

    constructor() {
        this.redis = new Redis({
            host: config.redis.host,
            port: config.redis.port,
            enableReadyCheck: false,
            maxRetriesPerRequest: null,
            lazyConnect: true,
        });
        this.keyPrefix = `${config.app.name}:${config.nodeEnv}:throttle`;
    }

    async increment(
        key: string,
        ttl: number,
        limit: number,
        blockDuration: number,
        throttlerName: string,
    ): Promise<IThrottlerStorageRecord> {
        const redisKey = `${this.keyPrefix}:${key}:${throttlerName}`;
        const blockKey = `${redisKey}:blocked`;

        // Early return if already blocked
        const isCurrentlyBlocked = await this.redis.get(blockKey);
        if (isCurrentlyBlocked) {
            const timeToBlockExpire = await this.redis.pttl(blockKey);
            const currentHits = await this.redis.get(redisKey);
            return {
                totalHits: parseInt(currentHits ?? '0', 10),
                timeToExpire: 0,
                isBlocked: true,
                timeToBlockExpire: Math.max(timeToBlockExpire, 0),
            };
        }

        const totalHits = await this.redis.incr(redisKey);

        if (totalHits === 1) {
            await this.redis.pexpire(redisKey, ttl);
        }

        const timeToExpire = await this.redis.pttl(redisKey);

        let isBlocked = false;
        let timeToBlockExpire = 0;

        if (totalHits > limit && blockDuration > 0) {
            await this.redis.set(blockKey, '1', 'PX', blockDuration);
            isBlocked = true;
            timeToBlockExpire = blockDuration;
        }

        return {
            totalHits,
            timeToExpire: Math.max(timeToExpire, 0),
            isBlocked,
            timeToBlockExpire: Math.max(timeToBlockExpire, 0),
        };
    }

    async onModuleDestroy(): Promise<void> {
        await this.redis.quit();
    }
}
