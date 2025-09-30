import { Global, Module } from '@nestjs/common';
import { AppConfigService } from './config.service';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal: true, 
      expandVariables: true,
      envFilePath: ['.env']
    }),
  ],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
