import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Loader } from '../Loader';
import { useAppSelector, useAppDispatch } from '../../lib/utils/hooks';
import { appState, removeModal, getFileList } from '../../state/app-state';
import { StorageFileList } from './StorageFileList';
import { ModalWithStoreHOC } from '../hoc/ModalWithStoreHOC';

interface StorageFileListModalProps {
  open: boolean;
  type: string;
}

export const STORAGE_LIST_MODAL = 'STORAGE_LIST_MODAL';

export const StorageFileListModal = ({
  open,
  type,
}: StorageFileListModalProps) => {
  const dispatch = useAppDispatch();
  const { uploadedFiles, loading, errors } = useAppSelector(appState);

  const style = {
    position: 'absolute',
    p: 2,
    top: '50%',
    left: '50%',
    width: '75%',
    boxShadow: 24,
    bgcolor: 'background.paper',
    transform: 'translate(-50%, -50%)',
  };

  if (!open || type !== STORAGE_LIST_MODAL) return <></>;

  useEffect(() => {
    // TODO - implement check against empty list for empty bucket
    if (!uploadedFiles || Object.keys(uploadedFiles).length === 0) {
      dispatch(getFileList());
    }
  }, [uploadedFiles]);

  return (
    <Modal
      open={open || false}
      onClose={() => dispatch(removeModal(STORAGE_LIST_MODAL))}
      aria-labelledby={STORAGE_LIST_MODAL}
      aria-describedby={STORAGE_LIST_MODAL}
    >
      <Box sx={style}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography margin={1} textAlign={'center'} variant={'h3'}>
              Uploaded Files
            </Typography>
          </Grid>
          {loading && (
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', justifyContent: 'center', margin: '15px' }}
            >
              <Loader />
            </Grid>
          )}
          {errors.length > 0 && (
            <Grid
              item
              xs={12}
              sx={{ display: 'flex', justifyContent: 'center', margin: '15px' }}
            >
              {errors.map((error, index) => (
                <Typography
                  key={`${index}-error`}
                  sx={{ color: 'red' }}
                  variant={'h5'}
                >
                  {error}
                </Typography>
              ))}
            </Grid>
          )}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            {uploadedFiles && Object.keys(uploadedFiles).length > 0 && (
              <StorageFileList files={Object.values(uploadedFiles)} />
            )}
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              name={'refresh'}
              size={'small'}
              variant='contained'
              aria-haspopup='true'
              onClick={() => dispatch(getFileList())}
              sx={{ fontSize: '1.5rem', marginRight: '2rem' }}
            >
              {'Refresh'}
            </Button>
            <Button
              name={'close'}
              size={'small'}
              variant='contained'
              aria-haspopup='true'
              onClick={() => dispatch(removeModal(STORAGE_LIST_MODAL))}
              sx={{ fontSize: '1.5rem' }}
            >
              {'Close'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export const StorageFileListModalWithStore = ModalWithStoreHOC(
  StorageFileListModal,
  STORAGE_LIST_MODAL
);
