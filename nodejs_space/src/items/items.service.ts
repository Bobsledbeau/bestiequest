import { Injectable } from '@nestjs/common';

export interface Item {
  id: string;
  name: string;
  category: 'creature' | 'person' | 'place' | 'object' | 'vehicle' | 'food' | 'nature';
  emoji: string;
}

@Injectable()
export class ItemsService {
  private readonly items: Item[] = [
    // Creatures
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
    
    // People
    { id: 'knight', name: 'Knight', category: 'person', emoji: '🤺' },
    { id: 'king', name: 'King', category: 'person', emoji: '🤴' },
    { id: 'queen', name: 'Queen', category: 'person', emoji: '👸' },
    { id: 'princess', name: 'Princess', category: 'person', emoji: '👑' },
    { id: 'prince', name: 'Prince', category: 'person', emoji: '🤴' },
    { id: 'fairy', name: 'Fairy', category: 'person', emoji: '🧚' },
    { id: 'pirate', name: 'Pirate', category: 'person', emoji: '🏴‍☠️' },
    { id: 'wizard', name: 'Wizard', category: 'person', emoji: '🧙' },
    
    // Places
    { id: 'castle', name: 'Castle', category: 'place', emoji: '🏰' },
    { id: 'house', name: 'House', category: 'place', emoji: '🏠' },
    { id: 'tree-house', name: 'Tree House', category: 'place', emoji: '🏡' },
    
    // Objects
    { id: 'magic umbrella', name: 'Magic Umbrella', category: 'object', emoji: '☂️' },
    { id: 'treasure', name: 'Treasure', category: 'object', emoji: '💰' },
    { id: 'book', name: 'Book', category: 'object', emoji: '📚' },
    
    // Vehicles
    { id: 'pirate ship', name: 'Pirate Ship', category: 'vehicle', emoji: '🏴‍☠️' },
    { id: 'spaceship', name: 'Spaceship', category: 'vehicle', emoji: '🚀' },
    { id: 'sports car', name: 'Sports Car', category: 'vehicle', emoji: '🏎️' },
    
    // Food
    { id: 'cheese', name: 'Cheese', category: 'food', emoji: '🧀' },
    { id: 'cake', name: 'Cake', category: 'food', emoji: '🍰' },
    
    // Nature
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

  getAllItems(): Item[] {
    return this.items;
  }

  getItemById(id: string): Item | undefined {
    return this.items.find(item => item.id === id);
  }

  validateItems(itemIds: string[]): { valid: boolean; invalidItems: string[] } {
    const invalidItems = itemIds.filter(id => !this.getItemById(id));
    return {
      valid: invalidItems.length === 0,
      invalidItems,
    };
  }
}
