"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemesService = void 0;
const common_1 = require("@nestjs/common");
let ThemesService = class ThemesService {
    themes = [
        {
            id: 'funny',
            name: 'Funny',
            description: 'Humorous, lighthearted stories with silly situations that make kids laugh',
            hasSubCategories: false,
            subCategories: [],
        },
        {
            id: 'magical',
            name: 'Magical',
            description: 'Fantasy tales filled with wonder, enchantment, and magical adventures',
            hasSubCategories: false,
            subCategories: [],
        },
        {
            id: 'life_lessons',
            name: 'Life Lessons',
            description: 'Stories that teach important values through engaging narratives',
            hasSubCategories: true,
            subCategories: [
                {
                    id: 'honesty',
                    name: 'Honesty',
                    description: 'Learning the importance of telling the truth',
                },
                {
                    id: 'friendship',
                    name: 'Friendship',
                    description: 'Understanding how to be a good friend',
                },
                {
                    id: 'loyalty',
                    name: 'Loyalty',
                    description: 'Being faithful and supportive to friends and family',
                },
                {
                    id: 'kindness',
                    name: 'Kindness',
                    description: 'Showing compassion and care for others',
                },
                {
                    id: 'respect',
                    name: 'Respect',
                    description: 'Treating others with courtesy and consideration',
                },
                {
                    id: 'gratitude',
                    name: 'Gratitude',
                    description: 'Being thankful and appreciating what we have',
                },
                {
                    id: 'perseverance',
                    name: 'Perseverance',
                    description: 'Never giving up and working hard to achieve goals',
                },
            ],
        },
        {
            id: 'learning',
            name: 'Learning',
            description: 'Educational stories that teach about the world around us',
            hasSubCategories: true,
            subCategories: [
                {
                    id: 'science',
                    name: 'Science',
                    description: 'Discovering how things work through experiments and exploration',
                },
                {
                    id: 'history',
                    name: 'History',
                    description: 'Learning about the past and important events',
                },
                {
                    id: 'geography',
                    name: 'Geography',
                    description: 'Exploring different places, countries, and landmarks',
                },
                {
                    id: 'animals',
                    name: 'Animals',
                    description: 'Learning about animals and their habitats',
                },
                {
                    id: 'ocean',
                    name: 'Ocean',
                    description: 'Discovering sea creatures and underwater ecosystems',
                },
                {
                    id: 'seasons',
                    name: 'Seasons',
                    description: 'Understanding the changing seasons and weather',
                },
            ],
        },
    ];
    getAllThemes() {
        return this.themes;
    }
    getThemeById(id) {
        return this.themes.find(theme => theme.id === id);
    }
    getSubCategoryById(themeId, subCategoryId) {
        const theme = this.getThemeById(themeId);
        if (!theme)
            return undefined;
        return theme.subCategories.find(sub => sub.id === subCategoryId);
    }
    validateThemeAndSubTheme(themeId, subThemeId) {
        const theme = this.getThemeById(themeId);
        if (!theme) {
            return { valid: false, error: `Invalid theme: ${themeId}` };
        }
        if (theme.hasSubCategories && !subThemeId) {
            return {
                valid: false,
                error: `Theme '${theme.name}' requires a sub-theme. Available: ${theme.subCategories.map(s => s.id).join(', ')}`
            };
        }
        if (!theme.hasSubCategories && subThemeId) {
            return {
                valid: false,
                error: `Theme '${theme.name}' does not have sub-categories`
            };
        }
        if (subThemeId) {
            const subCategory = this.getSubCategoryById(themeId, subThemeId);
            if (!subCategory) {
                return {
                    valid: false,
                    error: `Invalid sub-theme '${subThemeId}' for theme '${theme.name}'. Available: ${theme.subCategories.map(s => s.id).join(', ')}`
                };
            }
        }
        return { valid: true };
    }
};
exports.ThemesService = ThemesService;
exports.ThemesService = ThemesService = __decorate([
    (0, common_1.Injectable)()
], ThemesService);
//# sourceMappingURL=themes.service.js.map