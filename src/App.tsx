import React, { Suspense, lazy } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useBizFetch } from './lib/services/biz';
import { Loader } from './components/Loader';

const FileUpload = lazy(() =>
  import('./components/file/FileUpload').then(module => ({
    default: module.FileUpload,
  }))
);

const App = () => {
  const { data, error, loading } = useBizFetch();

  return (
    <Box sx={{ padding: '5px' }}>
      <Grid container spacing={1}>
        {loading && (
          <Grid item xs={12}>
            <Loader />
          </Grid>
        )}
        {error && (
          <Grid item xs={12}>
            <p>There is an error.</p>
          </Grid>
        )}
        {data && (
          <Suspense fallback={<Loader />}>
            <Grid item xs={12}>
              <FileUpload />
            </Grid>
          </Suspense>
        )}
      </Grid>
    </Box>
  );
};

export default App;
