export const QueueName = {
  Order: 'order',
  LogActivity: 'log-activity'
} as const;
export type TQueueName = typeof QueueName[keyof typeof QueueName]

export const QueueOrderJob = {
  ExpireOrder: 'expire-order',
} as const;
export type TQueueOrderJob =
  typeof QueueOrderJob[keyof typeof QueueOrderJob];

export const QueueLogActivityJob = {
  LogActivityCreate: 'log-activity-create',
} as const;
export type TQueueLogActivityJob =
  (typeof QueueLogActivityJob)[keyof typeof QueueLogActivityJob];

export type TQueueJob = TQueueOrderJob | TQueueLogActivityJob