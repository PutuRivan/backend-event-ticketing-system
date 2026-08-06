import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
    CallHandler,
    ExecutionContext,
    Inject,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Cache } from 'cache-manager';
import { Request } from 'express';
import { Observable, of, tap } from 'rxjs';
import { config } from '../../../../config';
import { CACHE_PREFIX_KEY } from '../decorators/cache-prefix.decorator';
import { CACHEABLE_KEY } from '../decorators/cacheable.decorator';
import { CacheKeyUtil } from '../utils/cache-key.util';

@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
    private readonly logger = new Logger(HttpCacheInterceptor.name)
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private reflector: Reflector,
    ) { }

    async intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest<Request>();

        if (request.method !== 'GET') return next.handle();

        const cachableOptions = this.reflector.getAllAndOverride(
            CACHEABLE_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!cachableOptions) return next.handle();

        const cachePrefix =
            this.reflector.getAllAndOverride(CACHE_PREFIX_KEY, [
                context.getHandler(),
                context.getClass(),
            ]) ?? '';

        const cacheKey =
            cachableOptions.key ??
            CacheKeyUtil.generate(
                cachePrefix,
                request.path,
                (request.query ?? {}) as Record<string, any>,
            );

        try {
            const cached = await this.cacheManager.get(cacheKey);

            if (cached !== null && cached !== undefined) {
                return of(cached);
            }
        } catch (e) {
            const err = e instanceof Error ? e : new Error(String(e));
            this.logger.error(`Cache set failed key=${cacheKey}`, err.stack);
            console.error("CACHE SET ERROR:", e);
        }

        const ttl = cachableOptions.ttl ?? config.cache.ttl;

        return next.handle().pipe(
            tap(async (response) => {
                await this.cacheManager.set(
                    cacheKey,
                    response,
                    ttl,
                );

                await this.cacheManager.get(cacheKey);

            }),
        );
    }
}
