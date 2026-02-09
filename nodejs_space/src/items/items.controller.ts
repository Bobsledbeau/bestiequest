import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ItemsService } from './items.service';

@ApiTags('Items')
@Controller('api/items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all available items/characters' })
  @ApiResponse({
    status: 200,
    description: 'List of all available items',
    schema: {
      example: {
        items: [
          { id: 'dragon', name: 'Dragon', category: 'creature' },
          { id: 'knight', name: 'Knight', category: 'person' },
        ],
      },
    },
  })
  getAllItems() {
    return { items: this.itemsService.getAllItems() };
  }
}
