import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState, type DependencyList } from "react";
import { getRequestErrorMessage } from "../services/apiClient";

/**
 * Carrega dados assíncronos e controla carregando/erro/tentar novamente.
 * Com `onFocus`, recarrega sempre que a tela volta a ficar visível.
 */
export function useLoad<T>(
  load: () => Promise<T>,
  deps: DependencyList = [],
  { onFocus = false } = {},
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const run = useCallback(() => {
    let current = true;

    load()
      .then((result) => {
        if (!current) return;
        setData(result);
        setError(null);
      })
      .catch((e) => current && setError(getRequestErrorMessage(e)))
      .finally(() => current && setLoading(false));

    return () => {
      current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  useEffect(() => (onFocus ? undefined : run()), [run, onFocus]);
  useFocusEffect(useCallback(() => (onFocus ? run() : undefined), [run, onFocus]));

  function reload() {
    setLoading(true);
    setAttempt((n) => n + 1);
  }

  return { data, setData, loading, error, reload };
}
