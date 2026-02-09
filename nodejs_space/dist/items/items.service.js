"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsService = void 0;
const common_1 = require("@nestjs/common");
let ItemsService = class ItemsService {
    items = [
        { id: 'dragon', name: 'Dragon', category: 'creature', emoji: '🐉' },
        { id: 'bunny', name: 'Bunny', category: 'creature', emoji: '🐰' },
        { id: 'horse', name: 'Horse', category: 'creature', emoji: '🐴' },
        { id: 'unicorn', name: 'Unicorn', category: 'creature', emoji: '🦄' },
        { id: 'butterfly', name: 'Butterfly', category: 'creature', emoji: '🦋' },
        { id: 'badger', name: 'Badger', category: 'creature', emoji: '🦡' },
        { id: 'cricket', name: 'Cricket', category: 'creature', emoji: '🦗' },
        { id: 'bear', name: 'Bear', category: 'creature', emoji: '🐻' },
        { id: 'bee', name: 'Bee', category: 'creature', emoji: '🐝' },
        { id: 'dog', name: 'Dog', category: 'creature', emoji: '🐕' },
        { id: 'cat', name: 'Cat', category: 'creature', emoji: '🐱' },
        { id: 'mouse', name: 'Mouse', category: 'creature', emoji: '🐭' },
        { id: 'worm', name: 'Worm', category: 'creature', emoji: '🪱' },
        { id: 'eagle', name: 'Eagle', category: 'creature', emoji: '🦅' },
        { id: 'pegasus', name: 'Pegasus', category: 'creature', emoji: '🦄' },
        { id: 'owl', name: 'Owl', category: 'creature', emoji: '🦉' },
        { id: 'elephant', name: 'Elephant', category: 'creature', emoji: '🐘' },
        { id: 'penguin', name: 'Penguin', category: 'creature', emoji: '🐧' },
        { id: 'dolphin', name: 'Dolphin', category: 'creature', emoji: '🐬' },
        { id: 'panda', name: 'Panda', category: 'creature', emoji: '🐼' },
        { id: 'fox', name: 'Fox', category: 'creature', emoji: '🦊' },
        { id: 'wolf', name: 'Wolf', category: 'creature', emoji: '🐺' },
        { id: 'knight', name: 'Knight', category: 'person', emoji: '🤺' },
        { id: 'king', name: 'King', category: 'person', emoji: '🤴' },
        { id: 'queen', name: 'Queen', category: 'person', emoji: '👸' },
        { id: 'princess', name: 'Princess', category: 'person', emoji: '👑' },
        { id: 'prince', name: 'Prince', category: 'person', emoji: '🤴' },
        { id: 'fairy', name: 'Fairy', category: 'person', emoji: '🧚' },
        { id: 'pirate', name: 'Pirate', category: 'person', emoji: '🏴‍☠️' },
        { id: 'wizard', name: 'Wizard', category: 'person', emoji: '🧙' },
        { id: 'castle', name: 'Castle', category: 'place', emoji: '🏰' },
        { id: 'house', name: 'House', category: 'place', emoji: '🏠' },
        { id: 'tree-house', name: 'Tree House', category: 'place', emoji: '🏡' },
        { id: 'magic umbrella', name: 'Magic Umbrella', category: 'object', emoji: '☂️' },
        { id: 'treasure', name: 'Treasure', category: 'object', emoji: '💰' },
        { id: 'book', name: 'Book', category: 'object', emoji: '📚' },
        { id: 'pirate ship', name: 'Pirate Ship', category: 'vehicle', emoji: '🏴‍☠️' },
        { id: 'spaceship', name: 'Spaceship', category: 'vehicle', emoji: '🚀' },
        { id: 'sports car', name: 'Sports Car', category: 'vehicle', emoji: '🏎️' },
        { id: 'cheese', name: 'Cheese', category: 'food', emoji: '🧀' },
        { id: 'cake', name: 'Cake', category: 'food', emoji: '🍰' },
        { id: 'rainbow', name: 'Rainbow', category: 'nature', emoji: '🌈' },
        { id: 'mushroom', name: 'Mushroom', category: 'nature', emoji: '🍄' },
        { id: 'moon', name: 'Moon', category: 'nature', emoji: '🌙' },
        { id: 'sun', name: 'Sun', category: 'nature', emoji: '☀️' },
        { id: 'star', name: 'Star', category: 'nature', emoji: '⭐' },
        { id: 'cloud', name: 'Cloud', category: 'nature', emoji: '☁️' },
        { id: 'rain', name: 'Rain', category: 'nature', emoji: '🌧️' },
        { id: 'flower', name: 'Flower', category: 'nature', emoji: '🌸' },
        { id: 'tree', name: 'Tree', category: 'nature', emoji: '🌳' },
    ];
    getAllItems() {
        return this.items;
    }
    getItemById(id) {
        return this.items.find(item => item.id === id);
    }
    validateItems(itemIds) {
        const invalidItems = itemIds.filter(id => !this.getItemById(id));
        return {
            valid: invalidItems.length === 0,
            invalidItems,
        };
    }
};
exports.ItemsService = ItemsService;
exports.ItemsService = ItemsService = __decorate([
    (0, common_1.Injectable)()
], ItemsService);
//# sourceMappingURL=items.service.js.map