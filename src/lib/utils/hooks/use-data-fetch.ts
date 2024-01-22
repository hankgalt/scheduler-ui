import { useState, useEffect } from 'react';
import { useFetch } from 'usehooks-ts';
import { BASE_URL } from '../../index';

export function useDataFetch<T>(url: string) {
  const { data, error } = useFetch<T>(`${BASE_URL}${url}`);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
  }, [url]);

  useEffect(() => {
    if (data || error) {
      setLoading(false);
    }
  }, [data, error]);

  return {
    data,
    error,
    loading,
  };
}
