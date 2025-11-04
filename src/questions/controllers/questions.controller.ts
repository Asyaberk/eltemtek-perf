import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiParam } from '@nestjs/swagger';
import { QuestionsService } from '../services/questions.service';
import { CreateQuestionDto, UpdateQuestionDto } from '../dtos/question.dto';
import { Question } from '../entities/question.entity';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly service: QuestionsService) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'List all performance questions' })
  @ApiOkResponse({
    description: 'Returns all questions.',
    schema: {
      example: [
        {
          id: 1,
          orderNo: 1,
          title: 'Genel İletişim Becerisi',
          description:
            'Fikirleri ifade etme ve dinleme kabiliyetine, üretken geri bildirim isteme ve sağlama yeterliliğine ve olumlu, etkili bir iletişim tarzına sahiptir. (Yazılı, sözlü ve dinleme becerilerini dikkate alınız.)',
        },
        {
          id: 2,
          orderNo: 2,
          title: 'Sorumluluk Sahibi',
          description:
            'Sorumlulukları yerine getirir, tam güven aşılar, sürekli denetim olmaksızın iyi çalışır.',
        },
      ],
    },
  })
  findAll() {
    return this.service.findAll();
  }

  @Get('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get a specific question by id' })
  @ApiOkResponse({
    description: 'Returns all questions.',
    schema: {
      example: [
        {
          id: 1,
          orderNo: 1,
          title: 'Genel İletişim Becerisi',
          description:
            'Fikirleri ifade etme ve dinleme kabiliyetine, üretken geri bildirim isteme ve sağlama yeterliliğine ve olumlu, etkili bir iletişim tarzına sahiptir. (Yazılı, sözlü ve dinleme becerilerini dikkate alınız.)',
        },
      ],
    },
  })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  //create new question
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new performance question' })
  @ApiCreatedResponse({
    description: 'Question successfully created.',
    type: Question,
  })
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.service.create(createQuestionDto);
  }

  //update
  @Put('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update an existing question by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Question ID',
  })
  @ApiOkResponse({
    description: 'Question successfully updated.',
    type: Question,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this.service.update(id, updateQuestionDto);
  }

  //Delete
  @Delete('/:id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a question by ID' })
  @ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Question ID',
  })
  @ApiNoContentResponse({
    description: 'Question successfully deleted. No content returned.',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }
}