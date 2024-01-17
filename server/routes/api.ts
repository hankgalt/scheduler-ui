import express, { Request, Response } from 'express';
import multer from 'multer';
import {
  uploadFile,
  listFiles,
  StorageFile,
} from '@hankgalt/cloud-storage-client';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads');
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

router.get('/biz', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Biz API response message' });
});

router.get('/other', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Other API response message' });
});

router.get('/file/list', async (req: Request, res: Response) => {
  const bucket = process.env.GCLOUD_BUCKET || '';
  try {
    const { files, error } = await listFiles(bucket);
    if (error) {
      res.status(500).json({ error });
      return;
    }
    res.status(200).json({ files });
  } catch (error) {
    res.status(500).json({ error });
  }
});

router.post('/upload', upload.array('files'), async function (req, res) {
  console.log('/upload: successfully uploaded files to server', req.files);

  const uploadedFile = req.files
    ? Array.isArray(req.files)
      ? req.files[0]
      : req.files['files'][0]
    : null;

  if (uploadedFile) {
    const bucket = process.env.GCLOUD_BUCKET || '';
    try {
      const { files, error } = await listFiles(bucket);
      if (error) {
        console.log(
          '/upload: error fetching file list from storage bucket',
          error
        );
      }
      if (files) {
        const existingFile: StorageFile | undefined = files.find(f =>
          f.name.includes(uploadedFile.filename)
        );
        if (
          existingFile &&
          existingFile.size === uploadedFile.size.toString()
        ) {
          console.log(
            '/upload: file already uploaded to storage bucket',
            existingFile
          );
          res.status(200).json({
            file: existingFile,
            message: 'File already uploaded to storage bucket',
          });
          return;
        }
      }
    } catch (error) {
      console.log(
        '/upload: error fetching file list from storage bucket',
        error
      );
    }

    try {
      const { file, error } = await uploadFile({
        file: uploadedFile,
        fileName: uploadedFile.filename,
      });

      if (error) {
        res.status(500).json({
          error,
          message: 'Error uploading files to storage bucket',
        });
        return;
      }
      console.log(
        '/upload: successfully uploaded files to storage bucket',
        file
      );
      res.status(201).json({
        file,
        message: 'Successfully uploaded files to server',
      });
      return;
    } catch (error) {
      res
        .status(500)
        .json({ error, message: 'Error uploading files to storage bucket' });
      return;
    }
  }
  res.status(500).json({ message: 'Error no file to upload' });
});

export default router;
