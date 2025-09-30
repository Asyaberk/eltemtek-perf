import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  public get root() {
    return {
      kafka: this.kafka,
    };
  }
 
  public get kafka() {
    const brokers = this.config.get<string>('KAFKA_BROKERS') || '';
    return {
      brokers: brokers
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      topic: this.config.get<string>('KAFKA_TOPIC') || 'topic-test',
    };
  }
}
 