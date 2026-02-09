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
var StoriesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoriesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_1 = require("@prisma/client");
const items_service_1 = require("../items/items.service");
const themes_service_1 = require("../themes/themes.service");
let StoriesService = StoriesService_1 = class StoriesService {
    configService;
    itemsService;
    themesService;
    logger = new common_1.Logger(StoriesService_1.name);
    prisma;
    constructor(configService, itemsService, themesService) {
        this.configService = configService;
        this.itemsService = itemsService;
        this.themesService = themesService;
        this.prisma = new client_1.PrismaClient();
    }
    async generateStory(dto) {
        this.logger.log(`Generating story with theme: ${dto.theme}, subTheme: ${dto.subTheme}, length: ${dto.length}`);
        const itemValidation = this.itemsService.validateItems(dto.selectedItems);
        if (!itemValidation.valid) {
            throw new common_1.BadRequestException(`Invalid items: ${itemValidation.invalidItems.join(', ')}`);
        }
        const themeValidation = this.themesService.validateThemeAndSubTheme(dto.theme, dto.subTheme);
        if (!themeValidation.valid) {
            throw new common_1.BadRequestException(themeValidation.error);
        }
        const theme = this.themesService.getThemeById(dto.theme);
        const subCategory = dto.subTheme
            ? this.themesService.getSubCategoryById(dto.theme, dto.subTheme)
            : undefined;
        const itemNames = dto.selectedItems
            .map(id => this.itemsService.getItemById(id)?.name)
            .filter((name) => !!name);
        const { title, story } = await this.generateStoryWithLLM(itemNames, theme.name, subCategory?.name, dto.length, dto.childName, dto.childGender);
        const savedStory = await this.prisma.story.create({
            data: {
                title,
                story,
                selecteditems: dto.selectedItems,
                theme: dto.theme,
                subtheme: dto.subTheme,
                length: dto.length,
                childname: dto.childName,
            },
        });
        this.logger.log(`Story generated successfully with ID: ${savedStory.id}`);
        return this.formatStoryResponse(savedStory);
    }
    async generateStoryWithLLM(items, themeName, subThemeName, length, childName, childGender) {
        const wordCount = this.getWordCount(length);
        let protagonist;
        if (childName && childGender) {
            protagonist = `${childName}, a ${childGender}`;
        }
        else if (childName) {
            protagonist = childName;
        }
        else if (childGender) {
            protagonist = `a curious ${childGender}`;
        }
        else {
            protagonist = 'a curious child';
        }
        const themeGuidance = this.getThemeGuidance(themeName, subThemeName);
        const prompt = `You are a wholesome storyteller creating bedtime stories for young children (ages 3-10). Always generate safe, positive, and engaging stories with happy endings. Use simple, fun language that's easy to read aloud.

**Story Inputs**:
- **Protagonist**: ${protagonist}
- **Characters/Items to Include**: ${items.join(', ')}
- **Theme**: ${themeName}${subThemeName ? ` - ${subThemeName}` : ''}
- **Target Length**: ${wordCount} words (aim for approximately ${wordCount} words with short sentences and vivid descriptions)

**Theme-Specific Guidance**:
${themeGuidance}

**Strict Safeguards - Follow these rules exactly, no exceptions**:
1. Stories must be completely appropriate for kids: No violence, scary elements, monsters that aren't friendly, death, injury, bad language, romance, sexual content, or anything frightening/upsetting.
2. Avoid any modern political, social justice, or "woke" themes, including discussions of gender identity, fluidity, diversity mandates, environmental activism, or inequality. Stick to timeless, neutral narratives focused on fun, magic, learning, or classic life lessons.
3. If characters have genders, use traditional binary pronouns (he/she) based on classic archetypes (e.g., a brave boy knight, a kind girl fairy). Do not introduce non-binary or fluid gender elements.
4. No hallucinations of inappropriate content—if the inputs don't fit naturally, adapt them positively without adding unsafe elements.
5. End every story on an uplifting note, reinforcing positivity.
6. Incorporate ALL listed characters/items naturally into the story.
7. Make ${protagonist} the hero/main character of the story.

**Story Format**:
- Start with "Once upon a time..."
- End with "The end."
- Use 3-4 short paragraphs with vivid descriptions to spark imagination
- Keep sentences short and easy to read aloud

**Output Format**:
Provide your response in JSON format with exactly this structure:
{
  "title": "An original, engaging story title that reflects the adventure",
  "story": "The complete story text starting with 'Once upon a time...' and ending with 'The end.' Use \\n\\n between paragraphs."
}`;
        try {
            const apiKey = this.configService.get('ABACUSAI_API_KEY');
            if (!apiKey) {
                throw new Error('ABACUSAI_API_KEY is not configured');
            }
            const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'grok-4-1-fast-non-reasoning',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a wholesome storyteller for young children (ages 3-10). Create safe, positive stories with traditional values and happy endings. Always respond with valid JSON only, following the exact format specified.',
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    response_format: { type: 'json_object' },
                    temperature: 0.8,
                    max_tokens: 3000,
                }),
                signal: AbortSignal.timeout(30000),
            });
            if (!response.ok) {
                const errorText = await response.text();
                this.logger.error(`LLM API error: ${response.status} - ${errorText}`);
                if (response.status === 429) {
                    throw new common_1.InternalServerErrorException('Rate limit exceeded. Please try again in a moment.');
                }
                if (response.status === 401) {
                    throw new common_1.InternalServerErrorException('API authentication failed. Please contact support.');
                }
                throw new Error(`LLM API returned status ${response.status}`);
            }
            const data = await response.json();
            const responseText = data.choices?.[0]?.message?.content?.trim();
            if (!responseText) {
                throw new Error('Empty response from LLM');
            }
            this.logger.log('Received response from LLM');
            let result;
            try {
                result = JSON.parse(responseText);
            }
            catch (parseError) {
                this.logger.error('Failed to parse LLM response as JSON', parseError);
                throw new Error('Invalid JSON response from LLM');
            }
            if (!result.title || !result.story) {
                this.logger.error('Invalid story structure from LLM', result);
                throw new Error('Invalid story structure from LLM');
            }
            const unsafeWords = ['scary', 'frightening', 'terrifying', 'horror', 'nightmare', 'afraid', 'fear'];
            const storyLower = result.story.toLowerCase();
            const hasUnsafeContent = unsafeWords.some(word => storyLower.includes(word));
            if (hasUnsafeContent) {
                this.logger.warn('Potentially unsafe content detected in story');
            }
            return result;
        }
        catch (error) {
            this.logger.error('Error generating story with LLM', error);
            this.logger.warn('Using fallback story due to LLM error');
            return this.getFallbackStory(items, themeName, subThemeName, protagonist);
        }
    }
    getWordCount(length) {
        switch (length) {
            case 'short':
                return 800;
            case 'medium':
                return 1200;
            case 'long':
                return 2000;
            default:
                return 1200;
        }
    }
    getThemeGuidance(themeName, subThemeName) {
        if (themeName === 'Funny') {
            return `- Create humorous situations with silly, lighthearted moments
- Include playful dialogue and funny mishaps
- Make children laugh with gentle comedy appropriate for bedtime
- End with a satisfying, happy resolution`;
        }
        if (themeName === 'Magical') {
            return `- Include fantasy elements like magic, enchantment, or wonder
- Create a sense of whimsy and imagination
- Use magical transformations or discoveries
- Make the magical elements feel special and delightful`;
        }
        if (themeName === 'Life Lessons') {
            const lessonGuidance = {
                'Honesty': `- Teach the value of telling the truth through the story
- Show how honesty builds trust and solves problems
- Demonstrate consequences of dishonesty and rewards of truthfulness
- Make the lesson natural, not preachy`,
                'Friendship': `- Show the importance of being a good friend
- Demonstrate sharing, caring, and supporting friends
- Include moments of friendship challenges and resolution
- Highlight how friends help each other`,
                'Loyalty': `- Teach about being faithful to friends and family
- Show characters supporting each other through challenges
- Demonstrate the value of keeping promises
- Illustrate how loyalty strengthens relationships`,
                'Kindness': `- Show acts of compassion and caring for others
- Demonstrate how kindness makes everyone feel good
- Include helping someone in need
- Show the positive impact of kind actions`,
            };
            return lessonGuidance[subThemeName || ''] || lessonGuidance['Friendship'];
        }
        if (themeName === 'Learning') {
            const learningGuidance = {
                'Geography': `- Teach about different places, countries, or landmarks
- Include interesting geographical facts in a fun way
- Explore different cultures or environments
- Make learning about the world exciting and accessible`,
                'Ocean Life': `- Teach about sea creatures and underwater ecosystems
- Include fascinating facts about ocean animals
- Explore coral reefs, deep sea, or coastal environments
- Make marine life educational and engaging`,
                'Animal Life': `- Teach about animals and their habitats
- Include interesting animal behaviors and characteristics
- Explore how animals live, eat, and interact
- Make wildlife learning fun and memorable`,
                'Space': `- Teach about stars, planets, and galaxies
- Include fascinating space facts
- Explore the solar system or beyond
- Make astronomy exciting and wonder-filled`,
                'Nature': `- Teach about plants, trees, and natural environments
- Include facts about ecosystems and nature
- Explore forests, gardens, or natural habitats
- Make environmental learning engaging`,
            };
            return learningGuidance[subThemeName || ''] || learningGuidance['Nature'];
        }
        return `- Create an engaging, age-appropriate narrative
- Include positive messages and happy endings`;
    }
    getFallbackStory(items, themeName, subThemeName, protagonist) {
        const itemList = items.slice(0, 3).join(', ');
        const themeDesc = subThemeName ? `${themeName} - ${subThemeName}` : themeName;
        return {
            title: `${protagonist}'s ${themeName} Adventure`,
            story: `Once upon a time, ${protagonist} embarked on a wonderful ${themeDesc.toLowerCase()} adventure.\n\nAlong the way, they met many friends including ${itemList}${items.length > 3 ? ' and others' : ''}. Together, they had the most amazing time exploring and learning. Each friend brought something special to the journey, making it truly magical.\n\nAs the sun began to set, ${protagonist} felt happy and grateful for all the new friends and experiences. With a warm heart and sleepy eyes, it was time to rest and dream of tomorrow's adventures.\n\nThe end. Sweet dreams!`,
        };
    }
    async getStories(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [stories, total] = await Promise.all([
            this.prisma.story.findMany({
                skip,
                take: limit,
                orderBy: { createdat: 'desc' },
            }),
            this.prisma.story.count(),
        ]);
        return {
            stories: stories.map((story) => this.formatStoryResponse(story)),
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async getStoryById(id) {
        const story = await this.prisma.story.findUnique({
            where: { id },
        });
        if (!story) {
            throw new common_1.NotFoundException(`Story with ID ${id} not found`);
        }
        return this.formatStoryResponse(story);
    }
    async toggleFavorite(id) {
        const story = await this.prisma.story.findUnique({
            where: { id },
        });
        if (!story) {
            throw new common_1.NotFoundException(`Story with ID ${id} not found`);
        }
        const updated = await this.prisma.story.update({
            where: { id },
            data: { isfavorite: !story.isfavorite },
        });
        return {
            id: updated.id,
            isFavorite: updated.isfavorite,
        };
    }
    async getFavoriteStories() {
        const stories = await this.prisma.story.findMany({
            where: { isfavorite: true },
            orderBy: { createdat: 'desc' },
        });
        return {
            stories: stories.map((story) => this.formatStoryResponse(story)),
        };
    }
    async deleteStory(id) {
        const story = await this.prisma.story.findUnique({
            where: { id },
        });
        if (!story) {
            throw new common_1.NotFoundException(`Story with ID ${id} not found`);
        }
        await this.prisma.story.delete({
            where: { id },
        });
    }
    formatStoryResponse(story) {
        return {
            id: story.id,
            title: story.title,
            story: story.story,
            selectedItems: story.selecteditems,
            theme: story.theme,
            subTheme: story.subtheme || undefined,
            length: story.length,
            childName: story.childname || undefined,
            isFavorite: story.isfavorite,
            createdAt: story.createdat.toISOString(),
        };
    }
    async onModuleDestroy() {
        await this.prisma.$disconnect();
    }
};
exports.StoriesService = StoriesService;
exports.StoriesService = StoriesService = StoriesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        items_service_1.ItemsService,
        themes_service_1.ThemesService])
], StoriesService);
//# sourceMappingURL=stories.service.js.map