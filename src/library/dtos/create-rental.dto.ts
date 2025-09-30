import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateRentalDto {

  //only area that we get from json
  @IsInt()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id of the book',
    example: '120'
  })
  bookId: number;
}
