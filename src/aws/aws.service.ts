import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { formatDate, getKoreaCurrentTime, getLastMonthDates } from './util';
import { MailService } from 'src/mail/mail.service';
require('aws-sdk/lib/maintenance_mode_message').suppress = true;
require('dotenv').config();

@Injectable()
export class AwsService {
  private readonly logger: Logger = new Logger(AwsService.name);
  private readonly costExplorer: AWS.CostExplorer;

  constructor(private readonly mailService: MailService) {
    AWS.config.update({
      region: process.env.AWS_REGION,
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    });

    this.costExplorer = new AWS.CostExplorer({ apiVersion: '2017-10-25' });
  }

  async getCostsUsage() {
    this.logger.debug(`AWS::getCostAndUsage`);

    const params = {
      TimePeriod: {
        Start: getLastMonthDates().firstDay,
        End: getLastMonthDates().lastDay,
      },
      Granularity: 'MONTHLY',
      Metrics: [
        'BLENDED_COST',
        // 'UNBLENDED_COST',
        // 'AMORTIZED_COST',
        // 'NET_UNBLENDED_COST',
        // 'NET_AMORTIZED_COST',
        // 'USAGE_QUANTITY',
        // 'NORMALIZED_USAGE_AMOUNT',
      ],
    };
    const costAndUsage = await this.costExplorer
      .getCostAndUsage(params)
      .promise();
    const cost = costAndUsage.ResultsByTime[0].Total.BlendedCost.Amount;
    console.log('cost', cost);

    const currentTime = formatDate(getKoreaCurrentTime());
    const body = `
    ${currentTime} 월 AWS 이용료 약 <b>${cost} USD</b>
    `;

    try {
      await this.mailService.sendMail(
        process.env.BILLING_REPORT_MAIL,
        `AWS ${getKoreaCurrentTime().getMonth()}월 사용요금`,
        body,
      );
    } catch (err) {
      throw new InternalServerErrorException(`mail 전송 실패`);
    }
  }
}
