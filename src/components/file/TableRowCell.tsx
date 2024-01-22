import React, { ReactNode } from 'react';
import TableCell from '@mui/material/TableCell';

export const TableRowCell = ({
  children,
}: {
  children: string | ReactNode;
}) => {
  return <TableCell sx={{ fontSize: '1.5rem' }}>{children}</TableCell>;
};
