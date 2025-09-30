import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { KafkaProducerService } from '@app/kafka/services/kafka.producer.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    //inject kafka module lib
    private readonly producerService: KafkaProducerService,
  ) { }
  

  //********** try the kafka on test post
  @Post('/kafka')
  //payload ex: { message: "hello" }
  async sendToKafka(@Body() payload: any) {
    //auto event, i will add it to book rent return 
    await this.producerService.produce(payload);
    return { status: 'ok', sent: payload };
  }



  @Get()
  manualCaching() {
    return this.appService.manualCaching();
  }

  @Get('/foo')
  getData2() {
    return this.appService.getData2();
  }
}
