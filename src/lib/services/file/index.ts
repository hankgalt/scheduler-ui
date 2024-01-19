import { BASE_URL } from '../../index';
import type {
  FilesResponse,
  FileRequest,
  CloudAPIResponse,
} from '@hankgalt/cloud-storage-client';

export const apiUploadFile = async (data: FormData) => {
  try {
    const res = await fetch(`${BASE_URL}/api/file/upload`, {
      method: 'POST',
      body: data,
    });
    return await res.json();
  } catch (error) {
    console.error('Error uploading files: ', error);
    return { error };
  }
};

export const apiListFiles = async (): Promise<FilesResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/api/file/list`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching file list: ', error);
    return { error } as FilesResponse;
  }
};

export const apiDeleteFile = async (
  params: FileRequest
): Promise<CloudAPIResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/api/file/delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    return await res.json();
  } catch (error) {
    console.error('Error deleting file: ', error);
    return { status: 'error', error } as CloudAPIResponse;
  }
};

export const apiListBucketFiles = async (
  bucket?: string
): Promise<FilesResponse> => {
  try {
    const res = await fetch(`${BASE_URL}/api/file/list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bucket }),
    });
    return await res.json();
  } catch (error) {
    console.error('Error fetching file list: ', error);
    return { error } as FilesResponse;
  }
};
