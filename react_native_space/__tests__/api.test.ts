import { fetchItems, fetchThemes, generateStory, toggleFavorite } from '../services/api';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedAxios.create.mockReturnValue(mockedAxios as any);
  });

  describe('fetchItems', () => {
    it('should fetch items successfully', async () => {
      const mockItems = [
        { id: 'dragon', name: 'Dragon', category: 'creature', emoji: '🐉' },
        { id: 'knight', name: 'Knight', category: 'person', emoji: '🤺' },
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: { items: mockItems } });

      const result = await fetchItems();

      expect(result).toEqual(mockItems);
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/items');
    });

    it('should throw error on failure', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchItems()).rejects.toThrow('Network error');
    });
  });

  describe('fetchThemes', () => {
    it('should fetch themes successfully', async () => {
      const mockThemes = [
        {
          id: 'funny',
          name: 'Funny',
          description: 'Humorous stories',
          hasSubCategories: false,
          subCategories: [],
        },
      ];

      mockedAxios.get.mockResolvedValueOnce({ data: { themes: mockThemes } });

      const result = await fetchThemes();

      expect(result).toEqual(mockThemes);
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/themes');
    });
  });

  describe('generateStory', () => {
    it('should generate story successfully', async () => {
      const requestData = {
        selectedItems: ['dragon', 'knight'],
        theme: 'funny',
        length: 'medium' as const,
      };

      const mockStory = {
        id: '123',
        title: 'The Dragon and the Knight',
        story: 'Once upon a time...',
        selectedItems: ['dragon', 'knight'],
        theme: 'funny',
        subTheme: null,
        length: 'medium' as const,
        isFavorite: false,
        createdAt: '2024-01-01T00:00:00.000Z',
      };

      mockedAxios.post.mockResolvedValueOnce({ data: mockStory });

      const result = await generateStory(requestData);

      expect(result).toEqual(mockStory);
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/stories/generate', requestData);
    });

    it('should handle API errors', async () => {
      const requestData = {
        selectedItems: ['dragon'],
        theme: 'funny',
        length: 'short' as const,
      };

      mockedAxios.post.mockRejectedValueOnce({
        response: {
          data: { message: 'Invalid request' },
        },
        isAxiosError: true,
      });

      await expect(generateStory(requestData)).rejects.toThrow();
    });
  });

  describe('toggleFavorite', () => {
    it('should toggle favorite successfully', async () => {
      const mockResponse = {
        id: '123',
        isFavorite: true,
      };

      mockedAxios.patch.mockResolvedValueOnce({ data: mockResponse });

      const result = await toggleFavorite('123');

      expect(result).toEqual(mockResponse);
      expect(mockedAxios.patch).toHaveBeenCalledWith('/api/stories/123/favorite');
    });
  });
});
