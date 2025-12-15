import { CsvData } from '../types';

export const parseCSV = (csvText: string): CsvData => {
  // Simple CSV parser handling standard comma separation and newlines
  // A robust implementation would handle quoted fields containing commas/newlines
  const lines = csvText.trim().split(/\r?\n/);
  
  if (lines.length === 0) {
    return { headers: [], rows: [], rawText: csvText };
  }

  // Basic split by comma, respecting simplistic structure
  // For production, use a library like PapaParse, but here we keep it lightweight
  const parseLine = (line: string) => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result.map(s => s.replace(/^"|"$/g, '')); // Remove surrounding quotes
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine);

  return {
    headers,
    rows,
    rawText: csvText
  };
};

export const downloadCsvFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
