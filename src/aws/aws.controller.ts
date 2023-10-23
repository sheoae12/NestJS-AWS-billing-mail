import { Controller, Get } from '@nestjs/common';
import { AwsService } from './aws.service';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Get()
  async getBilling() {
    return await this.awsService.getCostsUsage();
  }
}
