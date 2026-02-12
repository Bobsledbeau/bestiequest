import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import { ItemsService } from '../items/items.service';
import { ThemesService } from '../themes/themes.service';
import { GenerateStoryDto } from '../dto/generate-story.dto';

@Injectable()
export class StoriesService {
  private readonly logger = new Logger(StoriesService.name);
  private readonly prisma: PrismaClient;

  constructor(
    private readonly configService: ConfigService,
    private readonly itemsService: ItemsService,
    private readonly themesService: ThemesService,
  ) {
    this.prisma = new PrismaClient();
  }

  async generateStory(dto: GenerateStoryDto) {
    this.logger.log(`Generating story with theme: ${dto.theme}, subTheme: ${dto.subTheme}, length: ${dto.length}`);

    // Validate selected items
    const itemValidation = this.itemsService.validateItems(dto.selectedItems);
    if (!itemValidation.valid) {
      throw new BadRequestException(
        `Invalid items: ${itemValidation.invalidItems.join(', ')}`
      );
    }

    // Validate theme and sub-theme
    const themeValidation = this.themesService.validateThemeAndSubTheme(dto.theme, dto.subTheme);
    if (!themeValidation.valid) {
      throw new BadRequestException(themeValidation.error);
    }

    const theme = this.themesService.getThemeById(dto.theme);
    const subCategory = dto.subTheme 
      ? this.themesService.getSubCategoryById(dto.theme, dto.subTheme)
      : undefined;

    // Get item names for the prompt
    const itemNames = dto.selectedItems
      .map(id => this.itemsService.getItemById(id)?.name)
      .filter((name): name is string => !!name);

    // Generate story using LLM
    const { title, story } = await this.generateStoryWithLLM(
      itemNames,
      theme!.name,
      subCategory?.name,
      dto.length,
      dto.childName,
      dto.childGender,
    );

    // Save to database
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

private async generateStoryWithLLM(
  items: string[],
  themeName: string,
  subThemeName: string | undefined,
  length: string,
  childName?: string,
  childGender?: 'boy' | 'girl',
): Promise<{ title: string; story: string }> {
  const wordCount = this.getWordCount(length);
  let protagonist: string = 'a curious child';

  if (childName && childGender) {
    protagonist = `${childName}, a ${childGender}`;
  } else if (childName) {
    protagonist = childName;
  } else if (childGender) {
    protagonist = `a curious ${childGender}`;
  }

  const themeGuidance = this.getThemeGuidance(themeName, subThemeName);

  const prompt = `**YOU ARE A CHILDREN'S BEDTIME STORYTELLER - FOLLOW THESE RULES EXACTLY**

**WORD COUNT - THIS IS MANDATORY**:
You MUST write a story that is EXACTLY around ${wordCount} words long.
- Long story: 1900–2100 words
- Medium story: 1150–1250 words
- Short story: 750–850 words
Count your words. If the story is too short, KEEP WRITING more events, descriptions, and dialogue until you reach the target.
DO NOT summarize or end early.

**TITLE - THIS IS MANDATORY**:
Create a **cute, funny, magical, or endearing ORIGINAL title** that makes a child excited to read.
- NEVER use the child's name, gender, theme, or length in the title.
- NEVER use words like "adventure", "journey", "lesson"
- Bad examples: "Batman, a boy's Life Lessons Adventure", "Beau's Funny Adventure", "a curious child's Magical Adventure"
- Good examples: "The Brave Bunny Who Saved the Moon", "The Unicorn's Secret Midnight Party", "The Penguin Who Learned to Fly"

**Story Inputs**:
- Protagonist: ${protagonist}
- Characters/Items: ${items.join(', ')}
- Theme: ${themeName}${subThemeName ? ` - ${subThemeName}` : ''}

**Theme Guidance**:
${themeGuidance}

**Story Rules**:
- Start with "Once upon a time..."
- End with "The end."
- Use simple, fun language for read-aloud
- Incorporate ALL characters/items naturally
- Make ${protagonist} the hero

**Output** (JSON only):
{
  "title": "Cute, funny, or magical original title",
  "story": "Full story text..."
}`;

  let result: { title: string; story: string };

  try {
    const apiKey = this.configService.get<string>('XAI_API_KEY');
    if (!apiKey) {
      throw new Error('XAI_API_KEY is not configured');
    }

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-4-1-fast-non-reasoning',
        messages: [
          {
            role: 'system',
            content: 'You are a wholesome storyteller for young children. Create safe, positive stories with happy endings. Always respond with valid JSON only.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Grok API error: ${response.status} - ${errorText}`);
      throw new Error(`Grok API returned status ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content?.trim();

    if (!responseText) {
      throw new Error('Empty response from Grok');
    }

    result = JSON.parse(responseText);

    if (!result.title || !result.story) {
      this.logger.error('Invalid story structure from Grok', result);
      throw new Error('Invalid story structure from Grok');
    }
  } catch (error: any) {
    this.logger.error('Error generating story with Grok', error);
    this.logger.warn('Using fallback story due to Grok error');
    result = this.getFallbackStory(items, themeName, subThemeName, protagonist);
  }

  return result;
}

  private getWordCount(length: string): number {
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

  private getThemeGuidance(themeName: string, subThemeName?: string): string {
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
      const lessonGuidance: Record<string, string> = {
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
      const learningGuidance: Record<string, string> = {
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

  private getFallbackStory(
    items: string[],
    themeName: string,
    subThemeName: string | undefined,
    protagonist: string,
  ): { title: string; story: string } {
    const itemList = items.slice(0, 3).join(', ');
    const themeDesc = subThemeName ? `${themeName} - ${subThemeName}` : themeName;
    
    return {
      title: `${protagonist}'s ${themeName} Adventure`,
      story: `Once upon a time, ${protagonist} embarked on a wonderful ${themeDesc.toLowerCase()} adventure.\n\nAlong the way, they met many friends including ${itemList}${items.length > 3 ? ' and others' : ''}. Together, they had the most amazing time exploring and learning. Each friend brought something special to the journey, making it truly magical.\n\nAs the sun began to set, ${protagonist} felt happy and grateful for all the new friends and experiences. With a warm heart and sleepy eyes, it was time to rest and dream of tomorrow's adventures.\n\nThe end. Sweet dreams!`,
    };
  }

  async getStories(page: number = 1, limit: number = 10) {
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
      stories: stories.map((story: any) => this.formatStoryResponse(story)),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStoryById(id: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }

    return this.formatStoryResponse(story);
  }

  async toggleFavorite(id: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
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
      stories: stories.map((story: any) => this.formatStoryResponse(story)),
    };
  }

  async deleteStory(id: string) {
    const story = await this.prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      throw new NotFoundException(`Story with ID ${id} not found`);
    }

    await this.prisma.story.delete({
      where: { id },
    });

    // No return for 204 No Content
  }

  private formatStoryResponse(story: any) {
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
}
