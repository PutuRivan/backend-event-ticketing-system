export const Operation = {
    View: 'view',
    Create: 'create',
    Update: 'update',
    Delete: 'delete',
    Export: 'export',
    Import: 'import',
} as const;

export type TOperation = (typeof Operation)[keyof typeof Operation];
