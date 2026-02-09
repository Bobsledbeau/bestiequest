import { ThemesService } from './themes.service';
export declare class ThemesController {
    private readonly themesService;
    constructor(themesService: ThemesService);
    getAllThemes(): {
        themes: import("./themes.service").Theme[];
    };
}
