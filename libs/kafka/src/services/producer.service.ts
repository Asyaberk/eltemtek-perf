import { Kafka, Producer } from "kafkajs";
import { IProducer } from "./kafka.producer.service";

export const sleep = (timeout: number) => {
    return new Promise<void>((resolve) => setTimeout(resolve, timeout));
}

export class KafkaProducer implements IProducer {
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  constructor(
    private readonly topic: string,
    private readonly brokers: string[],
  ) {
    this.kafka = new Kafka({ brokers: this.brokers });
    this.producer = this.kafka.producer();
  }

  async connect() {
    let attempts = 0;
    const max = 10;
    while (true) {
      try {
        await this.producer.connect();
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
     await this.producer.disconnect();
  }

  async produce(message: any) {
    await this.producer.send({
      topic: this.topic,
      messages: [
        {
          value:
            typeof message === 'string' ? message : JSON.stringify(message),
        },
      ],
    });
  }
}