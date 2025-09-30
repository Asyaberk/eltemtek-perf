import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsInt } from "class-validator";

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Title of the book',
        example: 'Deep Work'
  })
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Author of the book',
        example: 'Cal Newport'
  })
  author: string;

  @IsInt()
  @IsNotEmpty()
  @ApiPropertyOptional({
    description: 'Year of the book was published',
    example: 2016,
  })
  publishedyear?: number;
}
