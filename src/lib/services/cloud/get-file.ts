import * as path from 'path';
import client from './client';
import {
  FileRequest,
  FileResponse,
  GCLOUD_DATA_DIR,
  GCLOUD_BUCKET_DEV,
  mapToStorageFile,
} from './index';

export async function getFile(req: FileRequest): Promise<FileResponse> {
  return new Promise<FileResponse>((resolve, reject) => {
    const destPath = path.join(GCLOUD_DATA_DIR, req.fileName);
    const bktName = req.bucket ? req.bucket : GCLOUD_BUCKET_DEV;
    const file = client.bucket(bktName).file(destPath);

    try {
      file
        .get()
        .then(function (data) {
          if (data && data.length > 0) {
            resolve({
              file: mapToStorageFile(data[0]),
            });
          } else {
            const err = new Error(`no file found`);
            console.error('getFile() - no file found, %o', { err });
            reject({ error: err });
          }
        })
        .catch(err => {
          console.error('getFile() - error getting file details, %o', { err });
          reject({ error: err });
        });
    } catch (err: any) {
      console.error('getFile() - system error, %o', { err });
      reject({ error: err });
    }
  });
}
