import React from 'react';
import Skeleton from '@mui/material/Skeleton';

interface TableSkeletonProps {
  rows?: number;
  columns: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns }) => (
  <>
    {Array.from({ length: rows }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: columns }).map((_, j) => (
          <td key={j} className="px-4 py-3">
            <Skeleton animation="wave" variant="rounded" height={20} />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default TableSkeleton;
