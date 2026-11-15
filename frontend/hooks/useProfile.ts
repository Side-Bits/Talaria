import { useCallback, useEffect, useState } from "react";

import { getProfile } from "@/services/api/profile";
import { ProfileData } from "@/types/profile";

type ProfileState =
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; data: ProfileData };

export function useProfile() {
  const [state, setState] = useState<ProfileState>({ status: "loading" });
  const [requestVersion, setRequestVersion] = useState(0);

  const retry = useCallback(() => {
    setState({ status: "loading" });
    setRequestVersion(version => version + 1);
  }, []);

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      try {
        const data = await getProfile();
        if (ignore) return;

        setState({ status: "success", data });
      } catch (error) {
        if (ignore) return;

        setState({
          status: "error",
          error: error instanceof Error ? error : new Error("Failed to load profile"),
        });
      }
    }

    void loadProfile();

    return () => {
      ignore = true;
    };
  }, [requestVersion]);

  return { state, retry };
}
