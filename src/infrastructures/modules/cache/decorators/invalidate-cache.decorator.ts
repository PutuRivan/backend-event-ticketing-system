import { SetMetadata } from "@nestjs/common";

export const INVALIDATE_CACHE_KEY = "cache:invalidate";

export const InvalidateCache = () =>
  SetMetadata(INVALIDATE_CACHE_KEY, true);