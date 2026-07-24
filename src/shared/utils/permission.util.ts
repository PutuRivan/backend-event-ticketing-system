import { IPermission } from '../../infrastructures/databases/interfaces/permission.interface';
import { Operation, TOperation } from '../constants/operation.constant';
import { PermissionResourceOperation } from '../constants/permission.constant';
import { Resource, TResource } from '../constants/resource.constant';

export const PermissionUtil = {
    getPermissionSlugs: (resource?: TResource) => {
        if (!resource) {
            const resources = Object.keys(
                PermissionResourceOperation,
            );

            return resources
                .map((res) => {
                    return PermissionResourceOperation[res].map(
                        (operation) => {
                            return `${res}.${operation}`;
                        },
                    );
                })
                .flat();
        }

        return PermissionResourceOperation[resource].map((operation) => {
            return `${resource}.${operation}`;
        });
    },

    getPermissionSlugsByEntities: (permissions: IPermission[]) => {
        const slugs = permissions.map((permission) => permission.slug);
        return Array.from(new Set(slugs));
    },

    getResources: () => {
        return Object.keys(PermissionResourceOperation);
    },

    getOperations: (): TOperation[] => {
        return Object.values(Operation);
    },

    getResourceBySlug: (slug: string): TResource | null => {
        const resourceValue = Object.values(Resource).find((res) =>
            res.startsWith(slug),
        );

        if (!resourceValue) {
            return null;
        }

        return resourceValue;
    },

    getOperationBySlug: (slug: string): TOperation | null => {
        const operationValue = Object.values(Operation).find((operation) =>
            operation.startsWith(slug),
        );

        if (!operationValue) {
            return null;
        }

        return operationValue;
    },

    getPermissionSlugByResourceAndOperation: (
        resource: TResource,
        operation: TOperation,
    ) => {
        return `${resource}.${operation}`;
    },
};
