import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Personelin 5 basamaklı sicil numarası',
    example: '00518',
  })
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

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'İşe giriş tarihi (YYYY-MM-DD formatında)',
    example: '2024-01-15',
  })
  hireDate?: string;

  // 👇 evaluatedBy alanı: başka bir user’ı (yönetici) temsil ediyor
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description:
      'Değerlendiren yöneticinin sicil numarası (evaluator_sicil_no alanına yazılır)',
    example: '00102',
  })
  evaluatedBySicilNo?: string;

  // Foreign Keys
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Department ID', example: 10 })
  department_id?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Role ID', example: 1 })
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
