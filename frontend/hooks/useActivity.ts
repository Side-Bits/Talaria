import { useCallback, useEffect, useState } from "react";

import { getTravelActivity } from "@/services/api/activity";
import { Activity } from "@/types/activity";

type ActivityState =
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; data: Activity };

export function useActivity(travelId?: string, activityId?: string) {
  const [state, setState] = useState<ActivityState>({ status: "loading" });
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setRequestVersion(version => version + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadActivity() {
      if (!travelId || !activityId) {
        setState({
          status: "error",
          error: new Error("Trip and activity IDs are required to load this activity"),
        });
        return;
      }

      try {
        const data = await getTravelActivity(travelId, activityId);
        if (ignore) return;

        setState({ status: "success", data });
      } catch (error) {
        if (ignore) return;

        setState({
          status: "error",
          error: error instanceof Error ? error : new Error("Failed to load activity"),
        });
      }
    }

    void loadActivity();

    return () => {
      ignore = true;
    };
  }, [travelId, activityId, requestVersion]);

  return { state, retry };
}
