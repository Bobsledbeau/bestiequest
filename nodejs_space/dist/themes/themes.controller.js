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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const themes_service_1 = require("./themes.service");
let ThemesController = class ThemesController {
    themesService;
    constructor(themesService) {
        this.themesService = themesService;
    }
    getAllThemes() {
        return { themes: this.themesService.getAllThemes() };
    }
};
exports.ThemesController = ThemesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all available themes' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'List of all available themes',
        schema: {
            example: {
                themes: [
                    {
                        id: 'adventure',
                        name: 'Adventure',
                        description: 'Exciting journeys and quests with brave heroes',
                    },
                    {
                        id: 'friendship',
                        name: 'Friendship',
                        description: 'Heartwarming stories about making friends and helping others',
                    },
                ],
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ThemesController.prototype, "getAllThemes", null);
exports.ThemesController = ThemesController = __decorate([
    (0, swagger_1.ApiTags)('Themes'),
    (0, common_1.Controller)('api/themes'),
    __metadata("design:paramtypes", [themes_service_1.ThemesService])
], ThemesController);
//# sourceMappingURL=themes.controller.js.map