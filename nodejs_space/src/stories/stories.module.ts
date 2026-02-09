import { Module } from '@nestjs/common';
import { StoriesController } from './stories.controller';
import { StoriesService } from './stories.service';
import { ItemsModule } from '../items/items.module';
import { ThemesModule } from '../themes/themes.module';

@Module({
  imports: [ItemsModule, ThemesModule],
  controllers: [StoriesController],
  providers: [StoriesService],
})
export class StoriesModule {}
