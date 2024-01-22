import React from 'react';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import { Typography } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import PreviewIcon from '@mui/icons-material/Preview';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useAppSelector, useAppDispatch } from '../../lib/utils/hooks';
import {
  appState,
  setModal,
  getFileList,
  deleteUploadedFile,
  searchWorkflowRuns,
  getWorkflowState,
} from '../../state/app-state';
import { TableRowCell, TableHeaderCell, WORKFLOW_RESULT_MODAL } from './index';
import type { AppStorageFile } from '../../state';

export const StorageFileList = ({ files }: { files: AppStorageFile[] }) => {
  const dispatch = useAppDispatch();
  const { fileInfos } = useAppSelector(appState);

  const handleDelete = (name: string, version: number | string) => {
    if (version === '' || name === '') return;
    const fileName = name.slice(name.indexOf('/') + 1);
    dispatch(deleteUploadedFile({ fileName, version })).then(() => {
      dispatch(getFileList());
    });
  };

  const handleValidate = (name: string) => {
    if (name === '') return;
    dispatch(searchWorkflowRuns({ externalRef: name }))
      .then(resp => {
        if (
          resp.type === '/workflow/search/fulfilled' &&
          resp.payload?.runs &&
          resp.payload.runs.length > 0
        ) {
          const run = resp.payload.runs[0];
          dispatch(
            getWorkflowState({ runId: run.runId, workflowId: run.workflowId })
          );
        }
      })
      .catch(err => {
        console.error('StorageFileList: searchWorkflowRuns error: ', err);
      });
  };

  const viewRunResults = (name: string) => {
    if (name === '') return;
    dispatch(
      setModal({ type: WORKFLOW_RESULT_MODAL, data: { fileName: name } })
    );
  };

  const isPreviewed = (file: AppStorageFile) =>
    fileInfos && fileInfos[file.name.slice(file.name.indexOf('/') + 1)]
      ? true
      : false;

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table stickyHeader size='small'>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Size</TableHeaderCell>
                <TableHeaderCell>Bucket</TableHeaderCell>
                <TableHeaderCell>Created At</TableHeaderCell>
                <TableHeaderCell>Updated At</TableHeaderCell>
                <TableCell sx={{ width: '250px', fontSize: '2rem' }}>
                  Actions
                </TableCell>
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
                  <TableRowCell>{file.bucket}</TableRowCell>
                  <TableRowCell>{file.createdAt}</TableRowCell>
                  <TableRowCell>{file.updatedAt}</TableRowCell>
                  <TableCell sx={{ width: '250px', fontSize: '1.5rem' }}>
                    <Grid container spacing={1}>
                      <Grid item>
                        <Tooltip
                          title={
                            <Typography sx={{ fontSize: '1rem' }}>
                              {isPreviewed(file) ? 'previewed' : 'preview'}
                            </Typography>
                          }
                          placement='top-start'
                          sx={{
                            fontSize: '1.5rem',
                            '.MuiTooltip-tooltip': { fontSize: '1.5rem' },
                          }}
                        >
                          <IconButton>
                            <PreviewIcon
                              color={isPreviewed(file) ? 'success' : 'action'}
                              fontSize='large'
                            />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      <Grid item>
                        <Tooltip
                          title={
                            <Typography sx={{ fontSize: '1rem' }}>
                              {'validate'}
                            </Typography>
                          }
                          placement='top-start'
                          sx={{ fontSize: '1.5rem' }}
                        >
                          <IconButton onClick={() => handleValidate(file.name)}>
                            <TaskAltIcon color={'info'} fontSize='large' />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                      {file.stateId && (
                        <Grid item>
                          <Tooltip
                            title={
                              <Typography sx={{ fontSize: '1rem' }}>
                                {'view stats'}
                              </Typography>
                            }
                            placement='top-start'
                            sx={{ fontSize: '1.5rem' }}
                          >
                            <IconButton
                              onClick={() => viewRunResults(file.name)}
                            >
                              <QueryStatsIcon color={'info'} fontSize='large' />
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      )}
                      <Grid item>
                        <Tooltip
                          title={
                            <Typography sx={{ fontSize: '1rem' }}>
                              {'delete'}
                            </Typography>
                          }
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};
