import { Module } from '@nestjs/common';
import { QuestionsController } from './controllers/questions.controller';
import { QuestionsService } from './services/questions.service';

@Module({
  controllers: [QuestionsController],
  providers: [QuestionsService]
})
export class QuestionsModule {}
