import React from 'react';
import { CsvData } from '../types';

interface ResultPreviewProps {
  data: CsvData;
}

const ResultPreview: React.FC<ResultPreviewProps> = ({ data }) => {
  // Show only up to 10 rows for preview to keep DOM light
  const previewRows = data.rows.slice(0, 10);
  const remainingCount = Math.max(0, data.rows.length - 10);

  if (data.headers.length === 0 && data.rows.length === 0) {
    return (
        <div className="w-full max-w-4xl mx-auto mt-8 p-8 bg-white rounded-xl shadow-sm border border-slate-200 text-center">
            <p className="text-slate-500">No tabular data found in the document.</p>
        </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-indigo-500">
            <path fillRule="evenodd" d="M4.5 2A2.5 2.5 0 002 4.5v11a2.5 2.5 0 002.5 2.5h11a2.5 2.5 0 002.5-2.5v-11A2.5 2.5 0 0015.5 2h-11zm1 5a1 1 0 000 2h9a1 1 0 100-2h-9zM4.5 9a1 1 0 000 2h9a1 1 0 100-2h-9zM4.5 13a1 1 0 000 2h9a1 1 0 100-2h-9z" clipRule="evenodd" />
          </svg>
          Data Preview
        </h3>
        <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
          {data.rows.length} rows found
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
            <tr>
              {data.headers.map((header, idx) => (
                <th key={idx} className="px-6 py-3 font-medium whitespace-nowrap">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row, rowIdx) => (
              <tr key={rowIdx} className="bg-white border-b border-slate-100 hover:bg-slate-50 last:border-b-0">
                {row.map((cell, cellIdx) => (
                  <td key={cellIdx} className="px-6 py-3 text-slate-700 whitespace-nowrap max-w-xs truncate">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {remainingCount > 0 && (
        <div className="p-3 text-center text-xs text-slate-500 bg-slate-50 border-t border-slate-200">
          ... and {remainingCount} more rows available in download
        </div>
      )}
    </div>
  );
};

export default ResultPreview;
