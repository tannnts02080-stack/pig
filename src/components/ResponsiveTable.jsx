import React from 'react';
import { useDeviceType } from '../hooks/useDeviceType';

/**
 * ResponsiveTable Component
 * Tự động chuyển đổi giữa table layout (desktop) và card layout (mobile)
 */
export default function ResponsiveTable({ 
  columns, // Array of { key, label, render?, className?, mobileLabel? }
  data, 
  keyExtractor,
  emptyMessage = "Không có dữ liệu",
  onRowClick,
  mobileCardRender, // Optional custom mobile card renderer
  className = ""
}) {
  const { isMobile } = useDeviceType();

  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="text-slate-400 text-sm">{emptyMessage}</div>
      </div>
    );
  }

  // Desktop: Traditional Table
  if (!isMobile) {
    return (
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className={`w-full text-left ${className}`}>
          <thead className="bg-slate-900 border-b border-slate-800">
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 ${col.className || ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-slate-900/50 divide-y divide-slate-800">
            {data.map((row, rowIdx) => (
              <tr 
                key={keyExtractor(row, rowIdx)}
                onClick={() => onRowClick && onRowClick(row)}
                className={`hover:bg-slate-800/50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, colIdx) => (
                  <td 
                    key={colIdx} 
                    className={`px-4 py-3 text-sm text-slate-200 ${col.className || ''}`}
                  >
                    {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // Mobile: Card Layout
  return (
    <div className="space-y-3">
      {data.map((row, rowIdx) => {
        const key = keyExtractor(row, rowIdx);
        
        // Use custom mobile card renderer if provided
        if (mobileCardRender) {
          return (
            <div 
              key={key}
              onClick={() => onRowClick && onRowClick(row)}
              className={`bg-slate-900/90 border border-slate-800 rounded-2xl p-4 ${onRowClick ? 'active:bg-slate-800 cursor-pointer' : ''}`}
            >
              {mobileCardRender(row, rowIdx)}
            </div>
          );
        }

        // Default mobile card layout
        return (
          <div 
            key={key}
            onClick={() => onRowClick && onRowClick(row)}
            className={`bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2 ${onRowClick ? 'active:bg-slate-800 cursor-pointer' : ''}`}
          >
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="flex justify-between items-start gap-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  {col.mobileLabel || col.label}
                </span>
                <span className="text-sm font-medium text-slate-200 text-right flex-1">
                  {col.render ? col.render(row[col.key], row, rowIdx) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/**
 * ResponsiveCardList Component
 * Pure card layout for both mobile and desktop
 */
export function ResponsiveCardList({ 
  data, 
  keyExtractor,
  renderCard,
  emptyMessage = "Không có dữ liệu",
  gridCols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  className = ""
}) {
  if (!data || data.length === 0) {
    return (
      <div className="py-12 text-center bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="text-slate-400 text-sm">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols} gap-3 sm:gap-4 ${className}`}>
      {data.map((item, idx) => (
        <div key={keyExtractor(item, idx)}>
          {renderCard(item, idx)}
        </div>
      ))}
    </div>
  );
}
