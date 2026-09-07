"use client";

import { useEffect, useState } from "react";
import { fetchStudyData, StudyRequestError } from "@/services/studyService";

export function useStudyResource<T>(path: string | null) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<{
    path: string | null;
    attempt: number;
    data: T | null;
    error: StudyRequestError | null;
    loading: boolean;
  }>({ path, attempt, data: null, error: null, loading: path !== null });

  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    setState({ path, attempt, data: null, error: null, loading: true });
    fetchStudyData<T>(path, controller.signal).then(
      (data) => {
        if (!controller.signal.aborted)
          setState({ path, attempt, data, error: null, loading: false });
      },
      (error: StudyRequestError) => {
        if (!controller.signal.aborted)
          setState({ path, attempt, data: null, error, loading: false });
      },
    );
    return () => controller.abort();
  }, [path, attempt]);

  const current = state.path === path && state.attempt === attempt;
  return {
    data: current ? state.data : null,
    error: current ? state.error : null,
    loading: path !== null && (!current || state.loading),
    retry: () => setAttempt((value) => value + 1),
  };
}
