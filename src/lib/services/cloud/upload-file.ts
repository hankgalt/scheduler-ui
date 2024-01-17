import client from './client';
import * as fs from 'fs';
import * as path from 'path';
import * as stream from 'stream';
import {
  FileRequest,
  FileResponse,
  mapToStorageFile,
  GCLOUD_DATA_DIR,
  GCLOUD_BUCKET_DEV,
} from './index';

export async function uploadFile(req: FileRequest): Promise<FileResponse> {
  return new Promise<FileResponse>((resolve, reject) => {
    const destPath = path.join(GCLOUD_DATA_DIR, req.fileName);
    const bktName = req.bucket ? req.bucket : GCLOUD_BUCKET_DEV;

    try {
      const storageFile = client.bucket(bktName).file(destPath);
      const fileWriteStream = storageFile.createWriteStream({
        metadata: {
          contentType: req.file?.mimetype,
        },
      });

      if (req.file) {
        const fileReadStream = fs.createReadStream(req.file?.path);
        fileReadStream
          .pipe(fileWriteStream)
          .on('error', err => {
            console.error('uploadFile() - error uploading file, %o', { err });
            fileWriteStream.end(); // Closing the WritableStream
            // storageFile.delete({ ignoreNotFound: true }); // Deleting file from bucket
            reject({ error: err });
          })
          .on('finish', () => {
            resolve({
              file: mapToStorageFile(storageFile),
            });
          });
      } else {
        const passthroughStream = new stream.PassThrough();
        passthroughStream.write('this is the file content');
        passthroughStream.end();
        passthroughStream
          .pipe(fileWriteStream)
          .on('error', err => {
            console.error('uploadFile() - error uploading file, %o', { err });
            fileWriteStream.end();
            reject({ error: err });
          })
          .on('finish', () => {
            resolve({
              file: mapToStorageFile(storageFile),
            });
          });
      }
    } catch (err) {
      console.error('uploadFile() - system error, %o', { err });
      reject({ error: err });
    }
  });
}
