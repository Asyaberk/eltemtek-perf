import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateQuestionDto {
  @ApiProperty({
    example: 21,
    description:
      'The order number where the question will be displayed (must be unique)',
  })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  orderNo: number;

  @ApiProperty({
    example: 'New Question Title',
    description: 'Short title of the question',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(128)
  title: string;

  @ApiProperty({
    example: 'This question measures a new competency of the employee.',
    description: 'Detailed description of the question',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
