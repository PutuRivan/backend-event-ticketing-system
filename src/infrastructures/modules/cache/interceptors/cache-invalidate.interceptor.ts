import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, tap } from "rxjs";

import { CacheService } from "../services/cache.service";
import { CACHE_PREFIX_KEY } from "../decorators/cache-prefix.decorator";
import { INVALIDATE_CACHE_KEY } from "../decorators/invalidate-cache.decorator";


@Injectable()
export class CacheInvalidateInterceptor
  implements NestInterceptor {

  constructor(
    private readonly reflector: Reflector,
    private readonly cacheService: CacheService,
  ) {}


  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {

    const invalidate =
      this.reflector.getAllAndOverride(
        INVALIDATE_CACHE_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );


    if (!invalidate) {
      return next.handle();
    }


    const prefix =
      this.reflector.getAllAndOverride<string>(
        CACHE_PREFIX_KEY,
        [
          context.getHandler(),
          context.getClass(),
        ],
      );


    return next.handle().pipe(
      tap(async () => {

        if(prefix) {

          console.log(
            "INVALIDATE CACHE:",
            prefix
          );

          await this.cacheService.deleteByPrefix(prefix);

        }

      }),
    );
  }
}