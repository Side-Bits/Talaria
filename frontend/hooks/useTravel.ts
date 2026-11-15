import { useCallback, useEffect, useState } from "react";

import { getTravel } from "@/services/api/travel";
import { Travel } from "@/types/travel";

type TravelState =
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; data: Travel };

export function useTravel(travelId?: string) {
  const [state, setState] = useState<TravelState>({ status: "loading" });
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setRequestVersion(version => version + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadTravel() {
      if (!travelId) {
        setState({
          status: "error",
          error: new Error("A trip ID is required to load this trip"),
        });
        return;
      }

      try {
        const data = await getTravel(travelId);
        if (ignore) return;

        setState({ status: "success", data });
      } catch (error) {
        if (ignore) return;

        setState({
          status: "error",
          error: error instanceof Error ? error : new Error("Failed to load trip"),
        });
      }
    }

    void loadTravel();

    return () => {
      ignore = true;
    };
  }, [travelId, requestVersion]);

  return { state, retry };
}
