import { Module } from '@nestjs/common';
import { AppConfigModule } from '@app/config';
import { KafkaConsumerService } from './services/kafka.consumer.service';
import { KafkaProducerService } from './services/kafka.producer.service';

@Module({
  imports: [AppConfigModule],
  providers: [KafkaConsumerService, KafkaProducerService],
  exports: [KafkaConsumerService, KafkaProducerService],
})
export class KafkaModule {}
