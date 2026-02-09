import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ThemesService } from './themes.service';

@ApiTags('Themes')
@Controller('api/themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available themes' })
  @ApiResponse({
    status: 200,
    description: 'List of all available themes',
    schema: {
      example: {
        themes: [
          {
            id: 'adventure',
            name: 'Adventure',
            description: 'Exciting journeys and quests with brave heroes',
          },
          {
            id: 'friendship',
            name: 'Friendship',
            description: 'Heartwarming stories about making friends and helping others',
          },
        ],
      },
    },
  })
  getAllThemes() {
    return { themes: this.themesService.getAllThemes() };
  }
}
