import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional, IsInt } from "class-validator";

//everything is optinal
export class UpdateBookDto {
    @IsOptional()
    @IsString()
    @ApiPropertyOptional(
        {
            description: 'Updated title of the book',
            example: 'Atomic Habits (Revised Edition)'
        })
    title?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        description: 'Updated author name',
        example: 'James Clear'
    })
    author?: string;

    @IsOptional()
    @IsInt()
    @ApiPropertyOptional({
        description: 'Updated year of publication',
        example: 2025
    })
    publishedyear?: number;
}