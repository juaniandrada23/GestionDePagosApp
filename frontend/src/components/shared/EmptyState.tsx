import React, { type ReactNode } from 'react';
import { MdSearch } from 'react-icons/md';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = <MdSearch className="text-2xl text-gray-400" />,
  title,
  subtitle,
}) => (
  <div className="flex flex-col items-center justify-center py-12 gap-3">
    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
      {icon}
    </div>
    <div className="text-center">
      <p className="text-sm text-gray-500 font-medium">{title}</p>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);

export default EmptyState;
