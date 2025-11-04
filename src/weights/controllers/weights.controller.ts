import { Controller, Get, Put, Param, Body, HttpCode, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { WeightsService } from '../services/weights.service';
import { UpdateWeightDto } from '../dtos/weigths.dto';

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
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWeightDto: UpdateWeightDto, 
  ) {
    return this.service.update(id, updateWeightDto.weight);
  }

}
