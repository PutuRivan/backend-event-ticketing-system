export const Resource = {
    User: 'user',
    Operation: 'operation',
    Resource: 'resource',
    Role: 'role',
    Permission: 'permission',
    LogActivity: 'log-activity',
};

export type TResource = (typeof Resource)[keyof typeof Resource];
