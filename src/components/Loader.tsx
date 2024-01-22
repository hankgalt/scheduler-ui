import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

export const Loader = (): JSX.Element => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress />
      <Typography variant={'h4'}>Loading...</Typography>
    </Box>
  );
};
