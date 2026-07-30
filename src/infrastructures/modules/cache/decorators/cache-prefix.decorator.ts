import { SetMetadata } from '@nestjs/common';

export const CACHE_PREFIX_KEY = 'cache:prefix';
export const CachePrefix = (prefix: string) => SetMetadata(CACHE_PREFIX_KEY, prefix);