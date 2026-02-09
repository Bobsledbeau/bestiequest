export interface Item {
    id: string;
    name: string;
    category: 'creature' | 'person' | 'place' | 'object' | 'vehicle' | 'food' | 'nature';
    emoji: string;
}
export declare class ItemsService {
    private readonly items;
    getAllItems(): Item[];
    getItemById(id: string): Item | undefined;
    validateItems(itemIds: string[]): {
        valid: boolean;
        invalidItems: string[];
    };
}
