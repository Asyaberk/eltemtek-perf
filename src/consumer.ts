import { AppConfigService } from "@app/config";
import { KafkaConsumerService } from "@app/kafka/services/kafka.consumer.service";
import { Injectable, OnModuleInit } from "@nestjs/common";

@Injectable()
export class TestConsumer implements OnModuleInit {
    constructor(
        private readonly consumer: KafkaConsumerService,
        private readonly config: AppConfigService,
    ) { }

  async onModuleInit() {
    await this.consumer.consume({
      topic: this.config.kafka.topic,
      config: { groupId: 'test-consumer' },
      onMessage: async (message) => {
        if (message.value) {
          console.log({ value: message.value.toString() });
        } else {
          console.log('Message value is null');
        }
      },
    });
  }
}