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

export type TQueueJob = TQueueOrderJob