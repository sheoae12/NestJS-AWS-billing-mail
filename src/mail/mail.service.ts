import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { formatDate, getKoreaCurrentTime } from 'src/aws/util';
require('dotenv').config();

@Injectable()
export class MailService {
  private logger: Logger = new Logger(MailService.name);
  private transporter = nodemailer.createTransport({
    port: 587,
    host: 'smtp.gmlail.com',
    secure: false,
    requireTLS: true,
    service: 'gmail',
    auth: {
      user: process.env.NODE_MAILER_ACCOUNT,
      pass: process.env.NODE_MAILER_PASS,
    },
  });

  async sendMail(to: string, subject: string, body: string) {
    const currentFormattedDate = formatDate(getKoreaCurrentTime());

    try {
      const info = await this.transporter.sendMail({
        from: process.env.NODE_MAILER_ACCOUNT,
        to,
        subject,
        html: body,
      });

      this.logger.log(`${currentFormattedDate} Send Mail (to: ${to})`);
    } catch (err) {
      this.logger.error(
        `${currentFormattedDate} Fail to Send Mail (to: ${to})`,
      );
      this.logger.error(err.stack);
    }
  }
}
