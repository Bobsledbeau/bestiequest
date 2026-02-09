import { IsArray, IsString, IsOptional, ArrayMinSize, ArrayMaxSize, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GenerateStoryDto {
  @ApiProperty({
    description: 'Array of selected item IDs (minimum 1, maximum 10)',
    example: ['dragon', 'knight', 'castle'],
    type: [String],
    minItems: 1,
    maxItems: 10,
  })
  @IsArray()
  @ArrayMinSize(1, { message: 'At least 1 item must be selected' })
  @ArrayMaxSize(10, { message: 'Maximum 10 items can be selected' })
  @IsString({ each: true })
  selectedItems: string[];

  @ApiProperty({
    description: 'Theme ID for the story',
    example: 'funny',
    enum: ['funny', 'magical', 'life_lessons', 'learning'],
  })
  @IsString()
  @IsIn(['funny', 'magical', 'life_lessons', 'learning'], { 
    message: 'Theme must be one of: funny, magical, life_lessons, learning' 
  })
  theme: string;

  @ApiPropertyOptional({
    description: 'Sub-theme ID (required for life_lessons and learning themes)',
    example: 'friendship',
  })
  @IsOptional()
  @IsString()
  subTheme?: string;

  @ApiProperty({
    description: 'Story length',
    example: 'medium',
    enum: ['short', 'medium', 'long'],
  })
  @IsString()
  @IsIn(['short', 'medium', 'long'], { message: 'Length must be short, medium, or long' })
  length: 'short' | 'medium' | 'long';

  @ApiPropertyOptional({
    description: 'Child name to personalize the story',
    example: 'Emma',
  })
  @IsOptional()
  @IsString()
  childName?: string;

  @ApiPropertyOptional({
    description: 'Child gender for story personalization',
    example: 'girl',
    enum: ['boy', 'girl'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['boy', 'girl'], { message: 'Gender must be boy or girl' })
  childGender?: 'boy' | 'girl';
}
