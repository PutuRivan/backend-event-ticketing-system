import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MailSendDto } from '../../mail/dto/mail-send.dto';
import { MailService } from '../../mail/services/mail.service';
import { QueueMailJob, QueueName } from '../constants/queue.constant';

@Processor(QueueName.Mail)
export class QueueMailProcessor extends WorkerHost {
    constructor(private readonly mailService: MailService) {
        super();
    }

    async process(job: Job): Promise<void> {
        try {
            const jobName = job.name;
            if (jobName === QueueMailJob.MailSend) {
                const { to, subject, template, context, attachments } =
                    job.data as MailSendDto;

                await this.mailService.sendMail({
                    to,
                    subject,
                    template,
                    context,
                    attachments
                });
            } else {
                throw new Error(`Unknown job name: ${jobName}`);
            }
        } catch (error: any) {
            console.error(error);
            throw new Error(`Failed to process job: ${error.message}`);
        }
    }
}
