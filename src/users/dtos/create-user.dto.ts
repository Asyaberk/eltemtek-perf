// src/users/dtos/create-user.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Personel sicil numarası', example: 'A12345' })
  sicil_no: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Ad', example: 'Asya' })
  first_name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Soyad', example: 'Berk' })
  last_name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ description: 'E-posta', example: 'user@mail.com' })
  email: string;

  // Auth tarafı için şifre opsiyonel (import’ta olmayabilir)
  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Parola (opsiyonel, importta boş gelebilir)',
    example: 'password123',
  })
  password?: string;

  // FK’ler (Excel’den isimle geleceği için import aşamasında id’ye çevireceğiz)
  @Type(() => Number)
  @IsInt()
  @ApiProperty({ description: 'Role ID', example: 1 })
  role_id: number;

  @Type(() => Number)
  @IsInt()
  @ApiProperty({ description: 'Department ID', example: 10 })
  department_id: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Office ID', example: 3 })
  office_id?: number;

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
