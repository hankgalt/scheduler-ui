import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import * as fs from 'fs';
import { GCloudStorageClient } from '@hankgalt/cloud-storage-client';
import type { StorageFile } from '@hankgalt/cloud-storage-client';

const FILE_STORAGE_DIR = process.env.FILE_STORAGE_DIR || './public/uploads';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, FILE_STORAGE_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log('fileFilter: file', file);
    const allowed = [
      'text/csv',
      'application/json',
      'application/pdf',
    ].includes(file.mimetype);
    cb(null, allowed);
  },
});

const storageClient = new GCloudStorageClient();

const fileAPIRouter = express.Router();

fileAPIRouter.post('/list', async (req: Request, res: Response) => {
  const reqBody = req.body;
  const bucket = reqBody.bucket || process.env.GCLOUD_BUCKET || '';
  const dataDir = process.env.DATA_DIR || '';
  try {
    const { files, error } = await storageClient.listFiles(bucket);
    if (error) {
      console.log(
        '/file/list: error fetching file list from storage bucket',
        error
      );
      res.status(500).json({ error });
      return;
    }

    const currDataDirFiles =
      dataDir !== '' && files
        ? files.filter(file => file.name.indexOf(dataDir) > -1)
        : files;
    res.status(200).json({ files: currDataDirFiles });
  } catch (error) {
    console.log(
      '/file/list: error fetching file list from storage bucket',
      error
    );
    res.status(500).json({ error });
  }
});

fileAPIRouter.post('/delete', async (req: Request, res: Response) => {
  const reqBody = req.body;
  try {
    const { status, error } = await storageClient.deleteFile({
      fileName: reqBody.fileName,
      version: reqBody.version,
    });
    if (error) {
      console.log(
        '/file/delete: error deleting file from storage bucket',
        error
      );
      res.status(500).json({ error });
      return;
    }

    res.status(200).json({ status });
  } catch (error) {
    console.log('/file/delete: error deleting file from storage bucket', error);
    res.status(500).json({ error });
  }
});

fileAPIRouter.post('/upload', upload.array('files'), async function (req, res) {
  const dataDir = process.env.DATA_DIR || '';
  const bucket = process.env.GCLOUD_BUCKET || '';

  const uploadedFile = req.files
    ? Array.isArray(req.files)
      ? req.files[0]
      : req.files['files'][0]
    : null;

  let uploaded = false;

  if (uploadedFile) {
    try {
      const { files, error } = await storageClient.listFiles(bucket);
      if (error) {
        console.log(
          '/file/upload: error fetching file list from storage bucket',
          error
        );
      }

      if (files) {
        const existingFile: StorageFile | undefined = files.find(
          f => f.name === path.join(dataDir, uploadedFile.filename)
        );
        if (
          existingFile &&
          existingFile.size === uploadedFile.size.toString()
        ) {
          res.status(200).json({
            file: existingFile,
            message: 'File already uploaded to storage bucket',
          });
          uploaded = true;
        }
      }
    } catch (error) {
      console.log(
        '/file/upload: error fetching file list from storage bucket',
        error
      );
    }

    if (!uploaded) {
      try {
        const { file, error } = await storageClient.uploadFile({
          file: uploadedFile,
          fileName: uploadedFile.filename,
        });

        if (error) {
          console.log(
            '/file/upload: error uploading file to storage bucket',
            error
          );
          res.status(500).json({
            error,
          });
          return;
        }
        res.status(201).json({
          file,
        });
        uploaded = true;
      } catch (error) {
        console.log(
          '/file/upload: error uploading file to storage bucket',
          error
        );
        res.status(500).json({ error });
        return;
      }
    }
  } else {
    res.status(500).json({ error: new Error('Error no file to upload') });
  }

  if (uploaded && uploadedFile) {
    try {
      fs.rmSync(path.join(FILE_STORAGE_DIR, uploadedFile.filename));
    } catch (error) {
      console.log('/file/upload: error deleting local file from server', error);
    }
  }
});

export default fileAPIRouter;
