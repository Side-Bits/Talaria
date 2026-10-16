import { useCallback, useEffect, useState } from 'react';

import { getTravels } from '@/services/api/travel';
import { Travel } from '@/types/travel';

type TravelsState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: { Going: Travel[]; Done: Travel[] } };

export function useTravels() {
  const [state, setState] = useState<TravelsState>({ status: 'loading' });
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setRequestVersion(version => version + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadTravels() {
      try {
        const data = await getTravels();
        if (ignore) return;

        setState({
          status: 'success',
          data: {
            Going: Array.isArray(data?.G) ? data.G : [],
            Done: Array.isArray(data?.D) ? data.D : [],
          },
        });
      } catch (error) {
        if (ignore) return;

        setState({
          status: 'error',
          error: error instanceof Error ? error : new Error('Failed to load trips'),
        });
      }
    }

    void loadTravels();

    return () => {
      ignore = true;
    };
  }, [requestVersion]);

  return { state, retry };
}
