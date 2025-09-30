import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsString, IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@mail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Password for the user account',
    example: 'password123',
  })
  password: string;

  @IsInt()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Role ID of the user (optional)',
    example: 1
  })
  roleId?: number;
}
