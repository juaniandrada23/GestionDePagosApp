import 'jspdf';
import type { CellHookData, Table, UserOptions } from 'jspdf-autotable';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: UserOptions) => void;
    lastAutoTable: Table;
  }
}

export type { CellHookData };
