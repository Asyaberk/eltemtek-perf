import { Consumer, ConsumerConfig, Kafka, KafkaMessage } from 'kafkajs';
import { IConsumer } from './kafka.consumer.service';
import { Logger } from '@nestjs/common';
import * as retry from 'async-retry';

export const sleep = (timeout: number) => {
  return new Promise<void>((resolve) => setTimeout(resolve, timeout));
};

export class KafkaConsumer implements IConsumer {
    private readonly kafka: Kafka;
    private readonly consumer: Consumer;
    private readonly logger: Logger;

    constructor(
        private readonly topic: string,
        config: ConsumerConfig,
        private readonly brokers: string[],
    ) {
        this.kafka = new Kafka({ brokers: this.brokers });
        this.consumer = this.kafka.consumer(config);
        this.logger = new Logger(`${topic}-${config.groupId}`);
    }
    
    async consume(onMessage: (message: KafkaMessage) => Promise<void>) {
        await this.consumer.subscribe({
            topic: this.topic,
        });
        await this.consumer.run({
            eachMessage: async ({ message, partition }) => {
                this.logger.debug(`Processing message partition: ${partition}`);
                try {
                    await retry(async () => onMessage(message), {
                        retries: 3,
                        onRetry: (error, attempt) =>
                            this.logger.error(
                                `Error consuming message, executing retry ${attempt}/3 ...`,
                                error
                            )
                    })
                } catch (err) {
                    //handle the failure messgae
                    //write then to db table or log them
                    //better to write to db
                }
            }
        })
    }

    async connect() {
        let attempts = 0;
        const max = 10;
        while (true) {
            try {
                await this.consumer.connect();
                return;
            } catch (err) {
                attempts++;
                console.error(`Kafka connect failed (#${attempts}). Retrying...`, err);
                if (attempts >= max) throw err;
                await sleep(5000);
            }
        }
    }

    async disconnect() {
        await this.consumer.disconnect();
    }
}
