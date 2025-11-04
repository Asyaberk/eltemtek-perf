import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { WeightsService } from '../services/weights.service';

@ApiTags('Weights')
@Controller('weights')
export class WeightsController {
  constructor(private readonly service: WeightsService) {}

  //Tüm weight kayıtlarını getir
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'List all role-question weights' })
  @ApiOkResponse({
    description: 'Returns all weights with related role and question info.',
    schema: {
      example: [
        {
          id: 1,
          role: { id: 1, name: 'Müdür' },
          question: { id: 2, title: 'Planlama' },
          weight: 0.5,
        },
      ],
    },
  })
  findAll() {
    return this.service.findAll();
  }

  //Tek weight getir
  @Get('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Get weight by ID' })
  @ApiOkResponse({
    description: 'Returns a specific weight by its ID.',
    schema: {
      example: {
        id: 1,
        role: { id: 1, name: 'Müdür' },
        question: { id: 2, title: 'Planlama' },
        weight: 1,
      },
    },
  })
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  //Yeni weight oluştur
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create new weight for a role-question pair' })
  @ApiCreatedResponse({
    description: 'Creates a new weight entry.',
    schema: {
      example: {
        id: 5,
        role: { id: 2, name: 'Şef' },
        question: { id: 3, title: 'Sorumluluk Sahibi' },
        weight: 1.5,
      },
    },
  })
  create(@Body() body: { roleId: number; questionId: number; weight: number }) {
    return this.service.create(body.roleId, body.questionId, body.weight);
  }

  //Weight güncelle
  @Put('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update existing weight' })
  @ApiOkResponse({
    description: 'Updates the weight value of an existing record.',
    schema: {
      example: {
        id: 5,
        role: { id: 2, name: 'Şef' },
        question: { id: 3, title: 'Sorumluluk Sahibi' },
        weight: 2,
      },
    },
  })
  update(@Param('id') id: number, @Body() body: { weight: number }) {
    return this.service.update(id, body.weight);
  }

  //Weight sil
  @Delete('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Delete weight by ID' })
  @ApiOkResponse({
    description: 'Deletes a weight record.',
    schema: {
      example: { message: 'Weight deleted successfully.' },
    },
  })
  delete(@Param('id') id: number) {
    return this.service.delete(id);
  }
}
