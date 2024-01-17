import client from './client';
import { FilesResponse, mapToFilesResponse } from './index';

export async function listFiles(bktName: string): Promise<FilesResponse> {
  return new Promise<FilesResponse>((resolve, reject) => {
    const bkt = client.bucket(bktName);

    try {
      bkt
        .getFiles()
        .then(function (data) {
          if (data && data.length > 0) {
            resolve(mapToFilesResponse(data[0]));
          } else {
            const err = new Error(`no objects found`);
            console.error('listFiles() - no objects found, %o', { err });
            reject({ error: err });
          }
        })
        .catch(err => {
          console.error('listFiles() - error getting objects, %o', { err });
          reject({ status: 'error', error: err });
        });
    } catch (err: any) {
      console.error('listFiles() - system error, %o', { err });
      reject({ error: err });
    }
  });
}
