import React, { useState, type ReactNode } from 'react';
import { MdKeyboardArrowDown } from 'react-icons/md';

interface CollapsibleSectionProps {
  title: string;
  icon: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  icon,
  defaultOpen = true,
  children,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2 text-gray-700 font-semibold">
          {icon}
          {title}
        </span>
        <MdKeyboardArrowDown
          className={`text-xl text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'} transition-[grid-template-rows] duration-200`}
      >
        <div className="overflow-hidden">
          <div className="px-5 pb-5 border-t border-gray-100">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
