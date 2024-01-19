import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Loader } from '../Loader';
import { useOtherFetch } from '../../lib/services/biz';
import { getFileInformation } from '../../lib/utils/helpers';
import { apiUploadFile } from '../../lib/services/file';
import { appState, setModal, updateFileInfo } from '../../state/app-state';
import { useAppSelector, useAppDispatch } from '../../lib/utils/hooks';
import {
  FileList,
  StorageFileListModalWithStore,
  STORAGE_LIST_MODAL,
} from './FileList';

export type OnSubmit = (event: React.MouseEvent<HTMLFormElement>) => void;
export type OnClick = (event: React.MouseEvent<HTMLButtonElement>) => void;
export type OnChange = (event: React.ChangeEvent<HTMLInputElement>) => void;

export const FileUpload = () => {
  const dispatch = useAppDispatch();
  const { fileInfos } = useAppSelector(appState);
  const [files, setFiles] = useState<FileList | null>(null);
  const { data, error, loading } = useOtherFetch();
  const [errors, setErrors] = useState<string[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [previewed, setPreviewed] = useState(false);

  useEffect(() => {
    if (error) {
      setErrors([error.message]);
    }
  }, [error]);

  useEffect(() => {
    let fileName = '';
    if (files && files.length > 0) {
      fileName = files[0].name;
    }
    if (fileName !== '' && fileInfos && fileInfos[fileName]) {
      setPreviewed(true);
    } else {
      setPreviewed(false);
    }
  }, [files, fileInfos]);

  const previewFileInfo: OnClick = event => {
    event.preventDefault();
    if (files && files[0]) {
      getFileInformation(files[0], true)
        .then(fileInfo => {
          if (fileInfo.error) {
            setErrors([JSON.stringify(fileInfo.error)]);
          } else if (fileInfo.info) {
            dispatch(updateFileInfo(fileInfo.info));
          }
        })
        .catch(error => {
          console.error('Error getting file info', error);
          setErrors([JSON.stringify(error)]);
        });
    }
  };

  const handleChange: OnChange = event => {
    event.preventDefault();
    const selectedFiles = event.target.files;
    setFiles(selectedFiles);
  };

  const handleSubmit: OnSubmit = event => {
    event.preventDefault();

    if (!files || files.length < 1) {
      setErrors(['Please select a file to upload']);
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    // formData.append('bucket', 'test-bucket');

    apiUploadFile(formData)
      .then(response => {
        if (response.error) {
          setErrors([JSON.stringify(response.error)]);
          return;
        }
        setMessages([
          response.message ? response.message : 'File uploaded successfully',
        ]);
      })
      .catch(error => {
        console.error('Error uploading files: ', error);
        setErrors([JSON.stringify(error)]);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={1}>
        {loading && (
          <Grid
            item
            xs={12}
            sx={{ display: 'flex', justifyContent: 'center', margin: '15px' }}
          >
            <Loader />
            <Typography variant={'h3'}>Loading...</Typography>
          </Grid>
        )}
        {data && (
          <>
            <Grid item xs={12}>
              <Typography
                variant={'h4'}
                align='center'
                color='text.secondary'
                gutterBottom
              >
                {`Upload File`}
              </Typography>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', justifyContent: 'center', margin: '15px' }}
            >
              <input
                type='file'
                accept='.csv,.pdf,.doc,.docx,.xml,.json'
                onChange={handleChange}
              />
            </Grid>
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', justifyContent: 'center' }}
            >
              <Button
                name={'preview'}
                disabled={!files || files.length < 1}
                size={'small'}
                variant='contained'
                onClick={previewFileInfo}
                sx={{ fontSize: '1.2rem', marginRight: '2rem' }}
              >
                {'Preview'}
              </Button>
              <Button
                name={'upload'}
                disabled={!files || files.length < 1 || !previewed}
                size={'small'}
                variant='contained'
                type='submit'
                sx={{ fontSize: '1.2rem', marginRight: '2rem' }}
              >
                {'Upload'}
              </Button>
              <Typography
                sx={{ fontSize: '3rem', marginRight: '2rem' }}
                variant={'body1'}
              >
                {'|'}
              </Typography>
              <Button
                name={'uploaded'}
                size={'small'}
                variant='contained'
                color='info'
                aria-haspopup='true'
                onClick={() => dispatch(setModal({ type: STORAGE_LIST_MODAL }))}
                sx={{ fontSize: '1.2rem', marginRight: '2rem' }}
              >
                {'Uploaded Files'}
              </Button>
            </Grid>
            {fileInfos && Object.keys(fileInfos).length > 0 && (
              <Grid
                item
                xs={12}
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                <FileList files={Object.values(fileInfos)} />
              </Grid>
            )}
          </>
        )}
        <StorageFileListModalWithStore />
        <Snackbar
          open={messages.length > 0}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={10000}
          onClose={() => setMessages([])}
        >
          <Alert
            onClose={() => setMessages([])}
            severity='success'
            variant='filled'
            sx={{ width: '100%' }}
          >
            {messages[0]}
          </Alert>
        </Snackbar>
        <Snackbar
          open={errors.length > 0}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          autoHideDuration={10000}
          onClose={() => setErrors([])}
        >
          <Alert
            onClose={() => setErrors([])}
            severity={'error'}
            variant={'filled'}
            sx={{ width: '100%' }}
          >
            {errors[0]}
          </Alert>
        </Snackbar>
      </Grid>
    </form>
  );
};
