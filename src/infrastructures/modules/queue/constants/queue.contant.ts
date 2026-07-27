export const QueueName = {
  Order: 'order',
  Mail: 'mail',
  Ticket: 'ticket',
} as const;

export const QueueOrderJob = {
  ExpireOrder: 'expire-order',
} as const;

export type TQueueOrderJob =
  typeof QueueOrderJob[keyof typeof QueueOrderJob];

export type TQueueName = typeof QueueName[keyof typeof QueueName]