import { ItemsService } from './items.service';
export declare class ItemsController {
    private readonly itemsService;
    constructor(itemsService: ItemsService);
    getAllItems(): {
        items: import("./items.service").Item[];
    };
}
