import { ConfigService } from '@nestjs/config';
import { ItemsService } from '../items/items.service';
import { ThemesService } from '../themes/themes.service';
import { GenerateStoryDto } from '../dto/generate-story.dto';
export declare class StoriesService {
    private readonly configService;
    private readonly itemsService;
    private readonly themesService;
    private readonly logger;
    private readonly prisma;
    constructor(configService: ConfigService, itemsService: ItemsService, themesService: ThemesService);
    generateStory(dto: GenerateStoryDto): Promise<{
        id: any;
        title: any;
        story: any;
        selectedItems: any;
        theme: any;
        subTheme: any;
        length: any;
        childName: any;
        isFavorite: any;
        createdAt: any;
    }>;
    private generateStoryWithLLM;
    private getWordCount;
    private getThemeGuidance;
    private getFallbackStory;
    getStories(page?: number, limit?: number): Promise<{
        stories: {
            id: any;
            title: any;
            story: any;
            selectedItems: any;
            theme: any;
            subTheme: any;
            length: any;
            childName: any;
            isFavorite: any;
            createdAt: any;
        }[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getStoryById(id: string): Promise<{
        id: any;
        title: any;
        story: any;
        selectedItems: any;
        theme: any;
        subTheme: any;
        length: any;
        childName: any;
        isFavorite: any;
        createdAt: any;
    }>;
    toggleFavorite(id: string): Promise<{
        id: string;
        isFavorite: boolean;
    }>;
    getFavoriteStories(): Promise<{
        stories: {
            id: any;
            title: any;
            story: any;
            selectedItems: any;
            theme: any;
            subTheme: any;
            length: any;
            childName: any;
            isFavorite: any;
            createdAt: any;
        }[];
    }>;
    deleteStory(id: string): Promise<void>;
    private formatStoryResponse;
    onModuleDestroy(): Promise<void>;
}
