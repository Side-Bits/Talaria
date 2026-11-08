import { useCallback, useEffect, useState } from 'react';

import { getTravelActivities } from '@/services/api/activity';
import { Activity } from '@/types/activity';

type ActivitiesState =
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: Activity[] };

export function useActivities(travelId?: string) {
  const [state, setState] = useState<ActivitiesState>({ status: 'loading' });
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => {
    setState({ status: 'loading' });
    setRequestVersion(version => version + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadActivities() {
      if (!travelId) {
        setState({
          status: 'error',
          error: new Error('A trip is required to load activities'),
        });
        return;
      }

      try {
        const data = await getTravelActivities(travelId);
        if (ignore) return;

        setState({
          status: 'success',
          data: Array.isArray(data) ? data : [],
        });
      } catch (error) {
        if (ignore) return;

        setState({
          status: 'error',
          error: error instanceof Error ? error : new Error('Failed to load activities'),
        });
      }
    }

    void loadActivities();

    return () => {
      ignore = true;
    };
  }, [travelId, requestVersion]);

  return { state, retry };
}
