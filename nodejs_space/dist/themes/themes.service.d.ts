export interface SubCategory {
    id: string;
    name: string;
    description: string;
}
export interface Theme {
    id: string;
    name: string;
    description: string;
    hasSubCategories: boolean;
    subCategories: SubCategory[];
}
export declare class ThemesService {
    private readonly themes;
    getAllThemes(): Theme[];
    getThemeById(id: string): Theme | undefined;
    getSubCategoryById(themeId: string, subCategoryId: string): SubCategory | undefined;
    validateThemeAndSubTheme(themeId: string, subThemeId?: string): {
        valid: boolean;
        error?: string;
    };
}
