import { Controller, Get, Post, Patch, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { StoriesService } from './stories.service';
import { GenerateStoryDto } from '../dto/generate-story.dto';
import { PaginationDto } from '../dto/pagination.dto';

@ApiTags('Stories')
@Controller('api/stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post('generate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Generate a new bedtime story' })
  @ApiResponse({
    status: 200,
    description: 'Story generated successfully',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        title: 'The Dragon and the Knight',
        story: 'Once upon a time...\n\nAnd they lived happily ever after.',
        selectedItems: ['dragon', 'knight', 'castle'],
        theme: 'funny',
        subTheme: null,
        length: 'medium',
        childName: 'Emma',
        isFavorite: false,
        createdAt: '2024-01-15T10:30:00.000Z',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async generateStory(@Body() dto: GenerateStoryDto) {
    return this.storiesService.generateStory(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all saved stories (paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of stories',
    schema: {
      example: {
        stories: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'The Dragon and the Knight',
            story: 'Once upon a time...',
            selectedItems: ['dragon', 'knight'],
            theme: 'funny',
            subTheme: null,
            length: 'medium',
            childName: 'Emma',
            isFavorite: false,
            createdAt: '2024-01-15T10:30:00.000Z',
          },
        ],
        total: 25,
        page: 1,
        totalPages: 3,
      },
    },
  })
  async getStories(@Query() paginationDto: PaginationDto) {
    return this.storiesService.getStories(paginationDto.page, paginationDto.limit);
  }

  @Get('favorites/list')
  @ApiOperation({ summary: 'Get all favorited stories' })
  @ApiResponse({
    status: 200,
    description: 'List of favorite stories',
    schema: {
      example: {
        stories: [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'The Dragon and the Knight',
            story: 'Once upon a time...',
            selectedItems: ['dragon', 'knight'],
            theme: 'funny',
            subTheme: null,
            length: 'medium',
            isFavorite: true,
            createdAt: '2024-01-15T10:30:00.000Z',
          },
        ],
      },
    },
  })
  async getFavoriteStories() {
    return this.storiesService.getFavoriteStories();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific story by ID' })
  @ApiParam({ name: 'id', description: 'Story UUID' })
  @ApiResponse({ status: 200, description: 'Story found' })
  @ApiResponse({ status: 404, description: 'Story not found' })
  async getStoryById(@Param('id') id: string) {
    return this.storiesService.getStoryById(id);
  }

  @Patch(':id/favorite')
  @ApiOperation({ summary: 'Toggle favorite status of a story' })
  @ApiParam({ name: 'id', description: 'Story UUID' })
  @ApiResponse({
    status: 200,
    description: 'Favorite status toggled',
    schema: {
      example: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        isFavorite: true,
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Story not found' })
  async toggleFavorite(@Param('id') id: string) {
    return this.storiesService.toggleFavorite(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a story' })
  @ApiParam({ name: 'id', description: 'Story UUID' })
  @ApiResponse({ status: 204, description: 'Story deleted successfully' })
  @ApiResponse({ status: 404, description: 'Story not found' })
  async deleteStory(@Param('id') id: string) {
    return this.storiesService.deleteStory(id);
  }
}
