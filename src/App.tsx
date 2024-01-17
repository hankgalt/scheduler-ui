import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useBizFetch } from './lib/services/biz';
import { FileUpload } from './components/FileUpload';
import { Loader } from './components/Loader';

const App = () => {
  const { data, error, loading } = useBizFetch();

  return (
    <React.Suspense fallback={<Loader />}>
      <Box sx={{ padding: '5px' }}>
        <Grid container spacing={1}>
          {error && (
            <Grid item xs={12}>
              <p>There is an error.</p>
            </Grid>
          )}
          {loading && (
            <Grid item xs={12}>
              <p>Loading...</p>
            </Grid>
          )}
          {data && (
            <Grid item xs={12}>
              <FileUpload />
            </Grid>
          )}
        </Grid>
      </Box>
    </React.Suspense>
  );
};
export default App;
