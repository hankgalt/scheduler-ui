import React from 'react';
import { Loader } from './components/Loader';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { useBizFetch } from './lib/services/biz';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const App = () => {
  const { data, error } = useBizFetch();

  if (error) return <p>There is an error.</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <React.Suspense fallback={<Loader />}>
      <Box sx={{ border: '1px solid red', padding: '5px' }}>
        <Grid container spacing={0} sx={{ border: '1px solid red' }}>
          {error && (
            <Grid item xs={12}>
              <p>There is an error.</p>
            </Grid>
          )}
          {!data && (
            <Grid item xs={12}>
              <p>Loading...</p>
            </Grid>
          )}
          {data && (
            <>
              <Grid item xs={8}>
                <Item>xs=8</Item>
              </Grid>
              <Grid item xs={4}>
                <Item>xs=4</Item>
              </Grid>
              <Grid item xs={4}>
                <Item>xs=4</Item>
              </Grid>
              <Grid item xs={8}>
                <Item>xs=8</Item>
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </React.Suspense>
  );
};
export default App;
