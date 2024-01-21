import type { WorkflowRunSearchParams } from '@hankgalt/scheduler-client';
import { useDataFetch } from '../../utils/hooks';
import { BASE_URL } from '../../index';

export interface BizResponse {
  message: string;
}

export const useBizFetch = () => {
  const { data, error, loading } = useDataFetch<BizResponse>(`/api/biz`);
  return { data, error, loading };
};

export const useOtherFetch = () => {
  const { data, error, loading } = useDataFetch<BizResponse>(`/api/other`);
  return { data, error, loading };
};

export const apiSearchWorkflowRuns = async (
  params: WorkflowRunSearchParams
) => {
  console.log('apiSearchWorkflowRuns - params', params);
  try {
    const res = await fetch(`${BASE_URL}/api/workflow/search`, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  } catch (error) {
    console.error('Error searching for workflow runs: ', error);
    return { error };
  }
};
