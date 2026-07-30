import { SetMetadata } from '@nestjs/common';

export const CACHEABLE_KEY = 'cache:cacheable';

export interface ICacheableOptions {
    ttl?: number;
    key?: string;
}

export const Cacheable = (options?: number | ICacheableOptions) => {
    let normalized: ICacheableOptions = {};

    if (typeof options === 'number') {
        normalized = { ttl: options };
    } else if (typeof options === 'object') {
        normalized = options;
    }

    return SetMetadata(CACHEABLE_KEY, normalized);
};
