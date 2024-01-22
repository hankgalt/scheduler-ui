import React from 'react';
import { Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import type { WorkflowResult } from '@hankgalt/scheduler-client/dist/lib/pkg';

interface WorkflowBatchInfoProps {
  result: WorkflowResult;
}

export const WorkflowBatchInfo = ({ result }: WorkflowBatchInfoProps) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant={'h4'}>{result.fileName}</Typography>
      </Grid>
      <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant={'h5'}>{result.requestedBy}</Typography>
      </Grid>
      <Grid item xs={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant={'h5'}>{result.workflowId}</Typography>
      </Grid>
      <Grid item xs={4} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant={'h5'}>{result.runId}</Typography>
      </Grid>
      <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant={'h5'}>{result.type}</Typography>
      </Grid>
      <Grid item xs={1} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant={'h5'}>{result.fileSize}</Typography>
      </Grid>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={1}>
          <Grid
            item
            xs={1}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <Typography variant={'h4'}>{'Headers: '}</Typography>
          </Grid>
          <Grid item xs={10} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant={'h5'}>
              {result.headers ? result.headers.headers.join(', ') : ''}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
