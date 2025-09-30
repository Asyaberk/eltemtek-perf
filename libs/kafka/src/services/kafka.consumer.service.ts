import { AppConfigService } from '@app/config';
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConsumerConfig, KafkaMessage } from 'kafkajs';
import { KafkaConsumer } from './consumer.service';

export interface KafkajsConsumerOptions {
  topic: string;
  config: ConsumerConfig;
  onMessage: (message: KafkaMessage) => Promise<void>;
}

export interface IConsumer {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  consume: (
    onMessage: (message: KafkaMessage) => Promise<void>,
  ) => Promise<void>;
}

@Injectable()
export class KafkaConsumerService implements OnApplicationShutdown {
    private readonly consumers: IConsumer[] = [];
    
    constructor(private readonly configService: AppConfigService) { }

    async consume({topic, config, onMessage}: KafkajsConsumerOptions) {
        const consumer = new KafkaConsumer(
            topic,
            config,
            this.configService.kafka.brokers,
        );
        await consumer.connect(); 
        await consumer.consume(onMessage);
        this.consumers.push(consumer);
    }

    async onApplicationShutdown() {
        for (const consumer of this.consumers) {
            await consumer.disconnect();
        }
    }
}
