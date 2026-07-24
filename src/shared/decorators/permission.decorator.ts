import { SetMetadata } from '@nestjs/common';
import { TOperation } from '../constants/operation.constant';
import { TResource } from '../constants/resource.constant';

export const PERMISSION_KEY = 'permission';

export const Permission = (resource: TResource, operations: TOperation[]) =>
    SetMetadata(PERMISSION_KEY, { resource, operations });
