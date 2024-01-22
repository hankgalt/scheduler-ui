import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useAppSelector, useAppDispatch } from '../../lib/utils/hooks';
import { appState, removeModal } from '../../state/app-state';
import { ModalWithStoreHOC } from '../hoc/ModalWithStoreHOC';
import { WorkflowBatchList } from './WorkflowBatchList';
import { WorkflowBatchInfo } from './WorkflowResultInfo';
import { FileReadResponse } from '../../lib/utils/helpers';
import { FileReadRequestProps } from './';

interface WorkflowResultModalProps {
  open: boolean;
  type: string;
  readRecord: (req: FileReadRequestProps) => Promise<FileReadResponse>;
}

export const WORKFLOW_RESULT_MODAL = 'WORKFLOW_RESULT_MODAL';

export const WorkflowResultModal = ({
  open,
  type,
  readRecord,
}: WorkflowResultModalProps) => {
  const dispatch = useAppDispatch();
  const { results, modal } = useAppSelector(appState);

  const result = results[modal?.data?.fileName || ''];

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

  if (!open || type !== WORKFLOW_RESULT_MODAL) return <></>;

  return (
    <Modal
      open={open || false}
      onClose={() => dispatch(removeModal(WORKFLOW_RESULT_MODAL))}
      aria-labelledby={WORKFLOW_RESULT_MODAL}
      aria-describedby={WORKFLOW_RESULT_MODAL}
    >
      <Box sx={style}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Typography margin={1} textAlign={'center'} variant={'h3'}>
              {'Workflow Run Result'}
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            {result && <WorkflowBatchInfo result={result} />}
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            {result && (
              <WorkflowBatchList result={result} readRecord={readRecord} />
            )}
          </Grid>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              name={'close'}
              size={'small'}
              variant='contained'
              aria-haspopup='true'
              onClick={() => dispatch(removeModal(WORKFLOW_RESULT_MODAL))}
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

export const WorkflowResultModalWithStore = ModalWithStoreHOC(
  WorkflowResultModal,
  WORKFLOW_RESULT_MODAL
);
