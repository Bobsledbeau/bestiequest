"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoriesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const stories_service_1 = require("./stories.service");
const generate_story_dto_1 = require("../dto/generate-story.dto");
const pagination_dto_1 = require("../dto/pagination.dto");
let StoriesController = class StoriesController {
    storiesService;
    constructor(storiesService) {
        this.storiesService = storiesService;
    }
    async generateStory(dto) {
        return this.storiesService.generateStory(dto);
    }
    async getStories(paginationDto) {
        return this.storiesService.getStories(paginationDto.page, paginationDto.limit);
    }
    async getFavoriteStories() {
        return this.storiesService.getFavoriteStories();
    }
    async getStoryById(id) {
        return this.storiesService.getStoryById(id);
    }
    async toggleFavorite(id) {
        return this.storiesService.toggleFavorite(id);
    }
    async deleteStory(id) {
        return this.storiesService.deleteStory(id);
    }
};
exports.StoriesController = StoriesController;
__decorate([
    (0, common_1.Post)('generate'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a new bedtime story' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal server error' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [generate_story_dto_1.GenerateStoryDto]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "generateStory", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all saved stories (paginated)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, example: 10 }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_dto_1.PaginationDto]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "getStories", null);
__decorate([
    (0, common_1.Get)('favorites/list'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all favorited stories' }),
    (0, swagger_1.ApiResponse)({
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
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "getFavoriteStories", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a specific story by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Story UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Story found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Story not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "getStoryById", null);
__decorate([
    (0, common_1.Patch)(':id/favorite'),
    (0, swagger_1.ApiOperation)({ summary: 'Toggle favorite status of a story' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Story UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Favorite status toggled',
        schema: {
            example: {
                id: '123e4567-e89b-12d3-a456-426614174000',
                isFavorite: true,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Story not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "toggleFavorite", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a story' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Story UUID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Story deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Story not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StoriesController.prototype, "deleteStory", null);
exports.StoriesController = StoriesController = __decorate([
    (0, swagger_1.ApiTags)('Stories'),
    (0, common_1.Controller)('api/stories'),
    __metadata("design:paramtypes", [stories_service_1.StoriesService])
], StoriesController);
//# sourceMappingURL=stories.controller.js.map