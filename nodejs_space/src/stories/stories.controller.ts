import { Controller, Get, Post, Delete, Param, Query, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { StoriesService } from './stories.service';
import { GenerateStoryDto } from '../dto/generate-story.dto';

@ApiTags('stories')
@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a new bedtime story' })
  @ApiResponse({ status: 201, description: 'Story generated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async generateStory(@Body() dto: GenerateStoryDto) {
    return this.storiesService.generateStory(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all stories with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'deviceId', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Stories retrieved successfully' })
  async getStories(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('deviceId') deviceId?: string,
  ) {
    return this.storiesService.getStories(page, limit, deviceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a story by ID' })
  @ApiResponse({ status: 200, description: 'Story retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Story not found' })
  async getStory(@Param('id') id: string) {
    return this.storiesService.getStoryById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a story' })
  @ApiQuery({ name: 'deviceId', required: false, type: String })
  @ApiResponse({ status: 204, description: 'Story deleted successfully' })
  @ApiResponse({ status: 403, description: 'Not authorized to delete this story' })
  @ApiResponse({ status: 404, description: 'Story not found' })
  async deleteStory(
    @Param('id') id: string,
    @Query('deviceId') deviceId?: string,
  ) {
    return this.storiesService.deleteStory(id, deviceId);
  }
}
