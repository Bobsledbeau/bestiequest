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
exports.GenerateStoryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class GenerateStoryDto {
    selectedItems;
    theme;
    subTheme;
    length;
    childName;
    childGender;
}
exports.GenerateStoryDto = GenerateStoryDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Array of selected item IDs (minimum 1, maximum 10)',
        example: ['dragon', 'knight', 'castle'],
        type: [String],
        minItems: 1,
        maxItems: 10,
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1, { message: 'At least 1 item must be selected' }),
    (0, class_validator_1.ArrayMaxSize)(10, { message: 'Maximum 10 items can be selected' }),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], GenerateStoryDto.prototype, "selectedItems", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Theme ID for the story',
        example: 'funny',
        enum: ['funny', 'magical', 'life_lessons', 'learning'],
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['funny', 'magical', 'life_lessons', 'learning'], {
        message: 'Theme must be one of: funny, magical, life_lessons, learning'
    }),
    __metadata("design:type", String)
], GenerateStoryDto.prototype, "theme", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Sub-theme ID (required for life_lessons and learning themes)',
        example: 'friendship',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateStoryDto.prototype, "subTheme", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Story length',
        example: 'medium',
        enum: ['short', 'medium', 'long'],
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['short', 'medium', 'long'], { message: 'Length must be short, medium, or long' }),
    __metadata("design:type", String)
], GenerateStoryDto.prototype, "length", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Child name to personalize the story',
        example: 'Emma',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GenerateStoryDto.prototype, "childName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Child gender for story personalization',
        example: 'girl',
        enum: ['boy', 'girl'],
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['boy', 'girl'], { message: 'Gender must be boy or girl' }),
    __metadata("design:type", String)
], GenerateStoryDto.prototype, "childGender", void 0);
//# sourceMappingURL=generate-story.dto.js.map