import { useDataFetch } from '../../utils/hooks';

export interface BizResponse {
  message: string;
}

export const useBizFetch = () => {
  const { data, error, loading } = useDataFetch<BizResponse>(`/api/biz`);
  return { data, error, loading };
};
