export const QueueName = {
  Mail: 'mail',
  Orders: 'orders',
  Tickets: 'tickets',
  Reminder: 'reminder',
  LogActivity: 'log-activity',
} as const;
export type TQueueName = typeof QueueName[keyof typeof QueueName]

export const QueueMailJob = {
  MailSend: 'mail-send',
} as const;
export type TQueueMailJob = (typeof QueueMailJob)[keyof typeof QueueMailJob];

export const QueueOrderJob = {
  ExpireOrder: 'expire-order',
} as const;
export type TQueueOrderJob =
  typeof QueueOrderJob[keyof typeof QueueOrderJob];

export const QueueTicketJob = {
  GenerateQrCode: 'generate-qr',
  GeneratePdf: 'generate-pdf',
  SendOrderEmail: 'send-order-email'
} as const
export type TQueueTicketJob = typeof QueueTicketJob[keyof typeof QueueTicketJob]

export const QueueReminderJob = {
  SendReminder: 'send-reminder',
} as const;

export type TQueueReminderJob =
  typeof QueueReminderJob[keyof typeof QueueReminderJob];

export const QueueLogActivityJob = {
  LogActivityCreate: 'log-activity-create',
} as const;
export type TQueueLogActivityJob =
  (typeof QueueLogActivityJob)[keyof typeof QueueLogActivityJob];

export type TQueueJob =
  TQueueOrderJob |
  TQueueTicketJob |
  TQueueLogActivityJob |
  TQueueMailJob |
  TQueueReminderJob