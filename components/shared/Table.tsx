import * as React from 'react';
import { cn } from '@/lib/utils';

export type TableRow = {
  id: string;
  cells: React.ReactNode[];
  onClick?: () => void;
};

export type TableProps = {
  tableLabel?: string;
  headers: string[];
  rows: TableRow[];
  className?: string;
  zebra?: boolean;
  withBorder?: boolean;
  page?: number;
  perPage?: number;
  total?: number;
  onPageChange?: (nextPage: number, perPage: number) => void;
};

export function Table({
  tableLabel,
  headers,
  rows,
  className,
  zebra = true,
  withBorder = true,
  page,
  perPage,
  total,
  onPageChange,
}: TableProps) {
  return (
    <div className={cn('rounded-lg overflow-hidden bg-white', className)} aria-label={tableLabel}>
      <div className={cn('w-full overflow-auto', withBorder && 'border border-gray-200')}>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              {headers.map((h, idx) => (
                <th key={idx} className={cn('px-4 py-3 font-medium text-gray-700', idx === 0 && 'pl-5')}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr
                key={row.id}
                className={cn(
                  'border-t border-gray-100',
                  zebra && rIdx % 2 === 1 ? 'bg-gray-50/40' : 'bg-white',
                  row.onClick && 'cursor-pointer hover:bg-gray-50'
                )}
                onClick={row.onClick}
              >
                {row.cells.map((cell, cIdx) => (
                  <td key={cIdx} className={cn('px-4 py-3 text-gray-800', cIdx === 0 && 'pl-5')}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {typeof page === 'number' && typeof perPage === 'number' && typeof total === 'number' && onPageChange && (
        <div className="flex items-center justify-end gap-2 p-3 border-t border-gray-200 text-sm">
          <span className="text-gray-600">
            {Math.min((page + 1) * perPage, total)} of {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              className="h-8 w-8 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
              onClick={() => onPageChange(0, perPage)}
              disabled={page === 0}
              aria-label="first page"
            >
              «
            </button>
            <button
              className="h-8 w-8 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
              onClick={() => onPageChange(Math.max(0, page - 1), perPage)}
              disabled={page === 0}
              aria-label="previous page"
            >
              ‹
            </button>
            <button
              className="h-8 w-8 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
              onClick={() => onPageChange(page + 1, perPage)}
              disabled={(page + 1) * perPage >= total}
              aria-label="next page"
            >
              ›
            </button>
            <button
              className="h-8 w-8 rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50"
              onClick={() => onPageChange(Math.max(0, Math.ceil(total / perPage) - 1), perPage)}
              disabled={(page + 1) * perPage >= total}
              aria-label="last page"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 