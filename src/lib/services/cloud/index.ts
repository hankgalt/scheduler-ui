import { File } from '@google-cloud/storage';

export const GCLOUD_BUCKET_PROD = 'comfforts-playground';
export const GCLOUD_BUCKET_DEV = 'comfforts-playground';
export const GCLOUD_KEY_FILE = `./creds/comfforts-369117-d723d4c3c218.json`;
export const GCLOUD_PRJ_ID = 'comfforts-369117';
export const GCLOUD_DATA_DIR = 'data';
export const GENERATION_MATCH_PRECONDITION = 0;

export interface CloudClient {
  uploadFile(req: FileRequest): Promise<FileResponse>;
  getFile(req: FileRequest): Promise<FileResponse>;
  deleteFile(req: FileRequest): Promise<CloudAPIResponse>;
  listFiles(bktName: string): Promise<FilesResponse>;
}

export type FilesResponse = {
  files?: StorageFile[];
  error?: Error;
};

export type FileRequest = {
  bucket?: string;
  fileName: string;
  file?: Express.Multer.File;
  version?: number | string;
};

export type CloudAPIResponse = {
  status: string;
  error?: Error;
};

export type FileResponse = {
  file?: StorageFile;
  error?: Error;
};

export type StorageFile = {
  name: string;
  bucket?: string;
  id?: string;
  size?: string | number;
  version?: number | string;
  createdAt?: string;
  updatedAt?: string;
};

export const mapToStorageFile = (f: File): StorageFile => {
  return {
    name: f.name,
    bucket: f.metadata.bucket,
    id: f.metadata.id,
    size: f.metadata.size,
    version: f.metadata.generation,
    createdAt: f.metadata.timeCreated,
    updatedAt: f.metadata.updated,
  };
};

export const mapToFilesResponse = (files: File[]): FilesResponse => {
  return {
    files: files.map(mapToStorageFile),
  };
};
