export declare class GenerateStoryDto {
    selectedItems: string[];
    theme: string;
    subTheme?: string;
    length: 'short' | 'medium' | 'long';
    childName?: string;
    childGender?: 'boy' | 'girl';
}
