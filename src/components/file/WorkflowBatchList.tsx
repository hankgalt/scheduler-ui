import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import TableContainer from '@mui/material/TableContainer';
import type {
  WorkflowResult,
  SuccessResult,
} from '@hankgalt/scheduler-client/dist/lib/pkg';
import { BusinessEntityType } from '@hankgalt/scheduler-client/dist/lib/pkg';
import { useAppDispatch } from '../../lib/utils/hooks';
import { getEntity } from '../../state/app-state';
import type { FileReadRequest } from '../../lib/utils/helpers';
import type { FileReadResponse } from '../../lib/utils/helpers';
import type { FileReadRequestProps } from './';

interface WorkflowBatchListProps {
  result: WorkflowResult;
  readRecord: (req: FileReadRequestProps) => Promise<FileReadResponse>;
}

export type OnClick = (event: React.MouseEvent<HTMLAnchorElement>) => void;

export const WorkflowBatchList = ({
  result,
  readRecord,
}: WorkflowBatchListProps) => {
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [successResult, setSuccessResult] = useState<SuccessResult | null>(
    null
  );
  const open = Boolean(anchorEl);

  const readBatchRecords = async ({
    start,
    end,
  }: Omit<FileReadRequest, 'file'>) => {
    await readRecord({ fileName: result.fileName, start, end });
  };

  const readFileRecord = async ({
    start,
    end,
  }: Omit<FileReadRequest, 'file'>) => {
    await readRecord({ fileName: result.fileName, start, end });
    setAnchorEl(null);
  };

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader size='small'>
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: '5%', fontSize: '2rem' }}>Index</TableCell>
            <TableCell sx={{ width: '7%', fontSize: '2rem' }}>Start</TableCell>
            <TableCell sx={{ width: '7%', fontSize: '2rem' }}>End</TableCell>
            <TableCell sx={{ width: '30%', fontSize: '2rem' }}>
              Results
            </TableCell>
            <TableCell sx={{ width: '30%', fontSize: '2rem' }}>
              Errors
            </TableCell>
            <TableCell sx={{ width: '10%', fontSize: '2rem' }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {result.batches.map((res, index) => (
            <TableRow key={`${index}-batch`}>
              <TableCell sx={{ width: '5%', fontSize: '1.5rem' }}>
                {res.batchIndex}
              </TableCell>
              <TableCell sx={{ width: '7%', fontSize: '1.5rem' }}>
                {res.start}
              </TableCell>
              <TableCell sx={{ width: '7%', fontSize: '1.5rem' }}>
                {res.end}
              </TableCell>
              <TableCell sx={{ width: '30%' }}>
                <Grid container spacing={1}>
                  {res.results &&
                    res.results.length > 0 &&
                    res.results.map((rest, idx) => (
                      <Grid item key={`${index}-${idx}-result`}>
                        <Tooltip
                          title={
                            <Typography
                              sx={{ fontSize: '1rem' }}
                            >{`end: ${rest.end}, resultId: ${rest.resultId}`}</Typography>
                          }
                          placement='top-start'
                          sx={{
                            fontSize: '1.5rem',
                          }}
                        >
                          <Button
                            variant={'contained'}
                            size='small'
                            color={'success'}
                            sx={{ borderRadius: 3, fontSize: '1.5rem' }}
                            startIcon={<BorderColorIcon />}
                            onClick={e => {
                              setSuccessResult(rest);
                              setAnchorEl(e.currentTarget);
                            }}
                          >
                            {rest.start}
                          </Button>
                        </Tooltip>
                        <Menu
                          id='basic-menu'
                          anchorEl={anchorEl}
                          open={open}
                          onClose={() => setAnchorEl(null)}
                          MenuListProps={{
                            'aria-labelledby': 'basic-button',
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              if (successResult) {
                                readFileRecord({
                                  start: parseInt(successResult.start),
                                  end: parseInt(successResult.end),
                                });
                              }
                            }}
                          >
                            {'read file record'}
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              if (successResult) {
                                dispatch(
                                  getEntity({
                                    id: successResult.resultId,
                                    type: result.type as BusinessEntityType,
                                  })
                                );
                              }
                              setAnchorEl(null);
                            }}
                          >
                            {'read DB record'}
                          </MenuItem>
                        </Menu>
                      </Grid>
                    ))}
                </Grid>
              </TableCell>
              <TableCell sx={{ width: '30%' }}>
                <Grid container spacing={1}>
                  {res.errors &&
                    res.errors.length > 0 &&
                    res.errors.map((err, idx) => (
                      <Grid item key={`${index}-${idx}-result`}>
                        <Tooltip
                          title={
                            <Typography
                              sx={{ fontSize: '1rem' }}
                            >{`end: ${err.end}, error: ${err.error}`}</Typography>
                          }
                          placement='top-start'
                          sx={{
                            fontSize: '1.5rem',
                          }}
                        >
                          <Button
                            variant='contained'
                            size='small'
                            sx={{ borderRadius: 3, fontSize: '1.5rem' }}
                            startIcon={<BorderColorIcon />}
                            onClick={() =>
                              readFileRecord({
                                start: parseInt(err.start),
                                end: parseInt(err.end),
                              })
                            }
                          >
                            {err.start}
                          </Button>
                        </Tooltip>
                      </Grid>
                    ))}
                </Grid>
              </TableCell>
              <TableCell sx={{ width: '10%', fontSize: '1.5rem' }}>
                <Grid container spacing={1}>
                  <Grid item>
                    <Tooltip
                      title={
                        <Typography sx={{ fontSize: '1rem' }}>
                          {'read batch'}
                        </Typography>
                      }
                      placement='top-start'
                    >
                      <IconButton
                        onClick={() =>
                          readBatchRecords({
                            start: parseInt(res.start),
                            end: parseInt(res.end),
                          })
                        }
                      >
                        <BorderColorIcon color={'action'} fontSize='large' />
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
  );
};
