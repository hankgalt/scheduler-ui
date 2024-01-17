import client from './client';
import * as path from 'path';
import {
  CloudAPIResponse,
  GCLOUD_DATA_DIR,
  GCLOUD_BUCKET_DEV,
  FileRequest,
} from './index';

export async function deleteFile(req: FileRequest): Promise<CloudAPIResponse> {
  return new Promise<CloudAPIResponse>((resolve, reject) => {
    const destPath = path.join(GCLOUD_DATA_DIR, req.fileName);
    const bktName = req.bucket ? req.bucket : GCLOUD_BUCKET_DEV;
    const bkt = client.bucket(bktName);

    const deleteOptions = {
      ifGenerationMatch: req.version,
    };

    try {
      bkt
        .file(destPath)
        .delete(deleteOptions)
        .then(() => {
          resolve({ status: 'ok' });
        })
        .catch(err => {
          console.error('deleteFile() - error deleting file, %o', { err });
          reject({ status: 'error', error: err });
        });
    } catch (err: any) {
      console.error('deleteFile() - system error, %o', { err });
      reject({ status: 'error', error: err });
    }
  });
}
