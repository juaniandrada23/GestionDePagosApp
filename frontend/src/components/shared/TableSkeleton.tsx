import React from 'react';

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
            <div className="h-5 bg-gray-200 rounded animate-pulse" />
          </td>
        ))}
      </tr>
    ))}
  </>
);

export default TableSkeleton;
