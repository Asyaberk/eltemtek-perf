import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Kullanıcının sicil numarası',
    example: '518',
  })
  sicil_no: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Kullanıcı parolası',
    example: 'password123',
  })
  password: string;
}
