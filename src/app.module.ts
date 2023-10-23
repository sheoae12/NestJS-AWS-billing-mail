import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AwsModule } from './aws/aws.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [AwsModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
