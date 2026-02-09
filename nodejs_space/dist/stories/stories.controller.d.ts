import { StoriesService } from './stories.service';
import { GenerateStoryDto } from '../dto/generate-story.dto';
import { PaginationDto } from '../dto/pagination.dto';
export declare class StoriesController {
    private readonly storiesService;
    constructor(storiesService: StoriesService);
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
    getStories(paginationDto: PaginationDto): Promise<{
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
    deleteStory(id: string): Promise<void>;
}
