import type {
  WorkflowRunSearchParams,
  FileWorkflowStateRequest,
  BusinessEntityRequest,
} from '@hankgalt/scheduler-client/dist/lib/pkg';
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
    console.error(
      'apiSearchWorkflowRuns - error searching for workflow runs: ',
      error
    );
    return { error };
  }
};

export const apiFileWorkflowState = async (
  params: FileWorkflowStateRequest
) => {
  try {
    const res = await fetch(`${BASE_URL}/api/workflow/query`, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  } catch (error) {
    console.error(
      'apiFileWorkflowState - error searching for workflow state: ',
      error
    );
    return { error };
  }
};

export const apiGetEntity = async (params: BusinessEntityRequest) => {
  try {
    const res = await fetch(`${BASE_URL}/api/entity/get`, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return await res.json();
  } catch (error) {
    console.error(
      'apiGetEntity - error searching for business entity: ',
      error
    );
    return { error };
  }
};
