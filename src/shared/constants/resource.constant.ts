export const Resource = {
    User: 'user',
    Operation: 'operation',
    Resource: 'resource',
    Role: 'role',
    Permission: 'permission',
    LogActivity: 'log-activity',
    Orders: 'orders'
};

export type TResource = (typeof Resource)[keyof typeof Resource];
