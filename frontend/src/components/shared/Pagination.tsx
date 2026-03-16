import React from 'react';
import { MdNavigateNext, MdNavigateBefore } from 'react-icons/md';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (updater: (prev: number) => number) => void;
  isMobile?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  isMobile,
}) => {
  if (totalItems === 0) return null;

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50/50">
      <span className="text-sm text-gray-500">
        {isMobile
          ? `${startIndex}-${endIndex} de ${totalItems}`
          : `Mostrando ${startIndex} a ${endIndex} de ${totalItems} registros`}
      </span>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange((p) => p - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-sm rounded-lg text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          <MdNavigateBefore className="text-lg" />
          {!isMobile && <span className="ml-0.5">Anterior</span>}
        </button>
        <span className="text-sm text-gray-600 font-medium px-2 tabular-nums">
          {currentPage} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => onPageChange((p) => p + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-sm rounded-lg text-gray-600 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {!isMobile && <span className="mr-0.5">Siguiente</span>}
          <MdNavigateNext className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
