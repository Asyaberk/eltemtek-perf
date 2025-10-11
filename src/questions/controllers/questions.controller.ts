import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { QuestionsService } from '../services/questions.service';

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
}
