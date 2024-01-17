import { useState, useEffect } from 'react';
import { useDispatch, TypedUseSelectorHook, useSelector } from 'react-redux';
import { useFetch } from 'usehooks-ts';
import { BASE_URL } from '../index';
import type { AppDispatch, RootState } from '../../state/store';

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

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
