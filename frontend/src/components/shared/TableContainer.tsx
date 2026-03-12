import React, { type ReactNode } from 'react';

interface TableContainerProps {
  title: string;
  count?: number;
  countLabel?: string;
  countLabelSingular?: string;
  headerAction?: ReactNode;
  children: ReactNode;
}

const TableContainer: React.FC<TableContainerProps> = ({
  title,
  count,
  countLabel = 'registros',
  countLabelSingular,
  headerAction,
  children,
}) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
      <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      <div className="flex items-center gap-3">
        {count !== undefined && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#006989]/10 text-[#006989]">
            {count} {count === 1 ? countLabelSingular || countLabel : countLabel}
          </span>
        )}
        {headerAction}
      </div>
    </div>
    <div className="overflow-x-auto">{children}</div>
  </div>
);

export default TableContainer;
