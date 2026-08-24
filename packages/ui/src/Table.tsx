import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Table: React.FC<React.TableHTMLAttributes<HTMLTableElement>> = ({ className, children, ...props }) => (
  <div className="w-full overflow-x-auto border border-[#EBEBE7] rounded">
    <table className={twMerge('w-full text-left text-xs', className)} {...props}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, children, ...props }) => (
  <thead className={twMerge('bg-[#FAFAF9] border-b border-[#EBEBE7] text-[#111111] font-medium', className)} {...props}>
    {children}
  </thead>
);

export const TableBody: React.FC<React.HTMLAttributes<HTMLTableSectionElement>> = ({ className, children, ...props }) => (
  <tbody className={twMerge('divide-y divide-[#EBEBE7] bg-white', className)} {...props}>
    {children}
  </tbody>
);

export const TableRow: React.FC<React.HTMLAttributes<HTMLTableRowElement>> = ({ className, children, ...props }) => (
  <tr className={twMerge('hover:bg-[#FAFAF9] transition-colors', className)} {...props}>
    {children}
  </tr>
);

export const TableHead: React.FC<React.ThHTMLAttributes<HTMLTableCellElement>> = ({ className, children, ...props }) => (
  <th className={twMerge('px-4 py-3 font-medium text-[#111111]', className)} {...props}>
    {children}
  </th>
);

export const TableCell: React.FC<React.TdHTMLAttributes<HTMLTableCellElement>> = ({ className, children, ...props }) => (
  <td className={twMerge('px-4 py-3 text-[#111111]', className)} {...props}>
    {children}
  </td>
);
