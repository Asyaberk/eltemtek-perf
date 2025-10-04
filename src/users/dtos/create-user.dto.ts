import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Personel sicil numarası', example: '518' })
  sicil_no: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Adı Soyadı', example: 'Adil Yasin BAŞTUĞ' })
  first_last_name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Parola (opsiyonel, import sırasında boş olabilir)',
    example: 'password123',
  })
  password?: string;

  // Foreign Keys
  @Type(() => Number)
  @IsInt()
  @ApiProperty({ description: 'Department ID', example: 10 })
  department_id?: number;

  @Type(() => Number)
  @IsInt()
  @ApiProperty({ description: 'Role ID', example: 1 })
  role_id?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Tesis ID', example: 2 })
  tesis_id?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Şeflik ID', example: 7 })
  seflik_id?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Müdürlük ID', example: 9 })
  mudurluk_id?: number;
}
