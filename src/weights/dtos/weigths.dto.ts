import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';


export class UpdateWeightDto {
  @ApiProperty({
    example: 2,
    description: '0.0 ile 2.0 arasındaki yeni katsayı puanı',
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(2)
  weight: number;
}