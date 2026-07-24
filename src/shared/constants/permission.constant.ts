import { Operation, TOperation } from './operation.constant';
import { Resource, TResource } from './resource.constant';

export const PermissionResourceOperation: Record<TResource, TOperation[]> = {
    [Resource.User]: [
        Operation.View,
        Operation.Create,
        Operation.Update,
        Operation.Delete,
        Operation.Export,
        Operation.Import,
    ],

    [Resource.Operation]: [
        Operation.View,
        Operation.Create,
        Operation.Update,
        Operation.Delete,
    ],

    [Resource.Resource]: [
        Operation.View,
        Operation.Create,
        Operation.Update,
        Operation.Delete,
    ],

    [Resource.Role]: [
        Operation.View,
        Operation.Create,
        Operation.Update,
        Operation.Delete,
    ],

    [Resource.Permission]: [
        Operation.View,
        Operation.Create,
        Operation.Update,
        Operation.Delete,
    ],

    [Resource.LogActivity]: [Operation.View, Operation.Import],
} as const;
