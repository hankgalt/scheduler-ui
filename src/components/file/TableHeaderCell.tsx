import React, { ReactNode } from 'react';
import TableCell from '@mui/material/TableCell';

export const TableHeaderCell = ({
  children,
}: {
  children: string | ReactNode;
}) => {
  return <TableCell sx={{ fontSize: '2rem' }}>{children}</TableCell>;
};
