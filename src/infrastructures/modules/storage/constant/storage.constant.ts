export const StorageDriver = {
  Local: 'local',
} as const;

export type TStorageDriver =
  typeof StorageDriver[keyof typeof StorageDriver];