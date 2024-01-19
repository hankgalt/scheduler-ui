import React, { ReactNode, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PreviewIcon from '@mui/icons-material/Preview';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Loader } from '../Loader';
import type { StorageFile } from '@hankgalt/cloud-storage-client';
import { useAppSelector, useAppDispatch } from '../../lib/utils/hooks';
import type { FileInformation } from '../../lib/utils/helpers';
import {
  appState,
  removeModal,
  getFileList,
  deleteUploadedFile,
} from '../../state/app-state';
import { ModalWithStoreHOC } from '../HOC/ModalWithStoreHOC';

export const TableHeaderCell = ({
  children,
}: {
  children: string | ReactNode;
}) => {
  return <TableCell sx={{ fontSize: '2rem' }}>{children}</TableCell>;
};

export const TableRowCell = ({
  children,
}: {
  children: string | ReactNode;
}) => {
  return <TableCell sx={{ fontSize: '1.5rem' }}>{children}</TableCell>;
};

export const FileList = ({ files }: { files: FileInformation[] }) => {
  return (
    <TableContainer component={Paper} sx={{ margin: '5px' }}>
      <Table stickyHeader size='small'>
        <TableHead sx={{ fontSize: '2rem' }}>
          <TableRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Size</TableHeaderCell>
            <TableHeaderCell>Type</TableHeaderCell>
            <TableHeaderCell>Headers</TableHeaderCell>
            <TableHeaderCell>Samples</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((file, index) => (
            <TableRow
              key={`${index}-storage-file`}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableRowCell>{file.name}</TableRowCell>
              <TableRowCell>{file.size}</TableRowCell>
              <TableRowCell>{file.type}</TableRowCell>
              <TableRowCell>
                <Typography key={`${index}-header`}>
                  {file.headers ? file.headers.join(', ') : ''}
                </Typography>
              </TableRowCell>
              <TableRowCell>
                {file.samples &&
                  file.samples.length > 0 &&
                  file.samples.map((sample, idx) => (
                    <Typography
                      key={`${index}-${idx}-sample`}
                      sx={{ marginBottom: '4px' }}
                    >
                      {file.type === 'text/csv'
                        ? sample.join(', ')
                        : JSON.stringify(sample)}
                    </Typography>
                  ))}
              </TableRowCell>
              <TableRowCell>
                <Grid container spacing={1}>
                  <Grid item>
                    <PreviewIcon fontSize='large' />
                  </Grid>
                </Grid>
              </TableRowCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export const StorageFileList = ({ files }: { files: StorageFile[] }) => {
  const dispatch = useAppDispatch();
  const { fileInfos, loading, errors } = useAppSelector(appState);

  const handleDelete = (name: string, version: number | string) => {
    if (version === '' || name === '') return;
    const fileName = name.slice(name.indexOf('/') + 1);
    dispatch(deleteUploadedFile({ fileName, version })).then(() => {
      dispatch(getFileList());
    });
  };

  return (
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
              variant={'h4'}
            >
              {error}
            </Typography>
          ))}
        </Grid>
      )}
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table stickyHeader size='small'>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Id</TableHeaderCell>
                <TableHeaderCell>Size</TableHeaderCell>
                <TableHeaderCell>Bucket</TableHeaderCell>
                <TableHeaderCell>Created At</TableHeaderCell>
                <TableHeaderCell>Updated At</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files.map((file, index) => (
                <TableRow
                  key={`${index}-storage-file`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableRowCell>{file.name}</TableRowCell>
                  <TableRowCell>{file.id}</TableRowCell>
                  <TableRowCell>{file.size}</TableRowCell>
                  <TableRowCell>{file.bucket}</TableRowCell>
                  <TableRowCell>{file.createdAt}</TableRowCell>
                  <TableRowCell>{file.updatedAt}</TableRowCell>
                  <TableRowCell>
                    <Grid container spacing={1}>
                      <Grid item>
                        <Tooltip
                          title={
                            fileInfos[
                              file.name.slice(file.name.indexOf('/') + 1)
                            ]
                              ? 'previewed'
                              : 'preview'
                          }
                          placement='top-start'
                          sx={{
                            fontSize: '1.5rem',
                            '.MuiTooltip-tooltip': { fontSize: '1.5rem' },
                          }}
                        >
                          <IconButton>
                            <PreviewIcon
                              color={
                                fileInfos[
                                  file.name.slice(file.name.indexOf('/') + 1)
                                ]
                                  ? 'success'
                                  : 'action'
                              }
                              fontSize='large'
                            />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <Tooltip
                          title='delete'
                          placement='top-start'
                          sx={{ fontSize: '1.5rem' }}
                        >
                          <IconButton
                            onClick={() =>
                              handleDelete(file.name, file.version || '')
                            }
                          >
                            <DeleteForeverIcon
                              color={'error'}
                              fontSize='large'
                            />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </TableRowCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

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
              <Typography variant={'h3'}>Loading...</Typography>
            </Grid>
          )}
          {errors.length > 0 && (
            <Grid item xs={12}>
              {errors.map((error, index) => (
                <Typography
                  key={`${index}-error`}
                  sx={{ color: 'red' }}
                  variant={'h4'}
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
