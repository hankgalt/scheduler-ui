import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PreviewIcon from '@mui/icons-material/Preview';
import type { FileInformation } from '../../lib/utils/helpers';
import { TableRowCell, TableHeaderCell } from './index';

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
            <TableCell sx={{ width: '200px', fontSize: '2rem' }}>
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
              <TableCell sx={{ width: '180px', fontSize: '1.5rem' }}>
                <Grid container spacing={1}>
                  <Grid item>
                    <PreviewIcon fontSize='large' />
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
