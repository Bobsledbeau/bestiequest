import { useEffect, useState } from 'react';
import { fetchItems, fetchThemes } from '../services/api';
import { useStory } from '../context/StoryContext';

export const useLoadData = () => {
  const { setItems, setThemes } = useStory();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [itemsData, themesData] = await Promise.all([
          fetchItems(),
          fetchThemes(),
        ]);
        
        setItems(itemsData);
        setThemes(themesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [setItems, setThemes]);

  return { loading, error };
};
