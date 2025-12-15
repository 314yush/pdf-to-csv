import { useState, useCallback } from 'react';
import { AppState, CsvData, FileData } from '../types';
import { readFileAsBase64 } from '../utils/fileUtils';
import { convertPdfToCsv } from '../services/geminiService';
import { parseCSV } from '../utils/csvUtils';

export interface UsePdfToCsvReturn {
  status: AppState;
  result: CsvData | null;
  fileMetadata: FileData | null;
  error: string | null;
  processTime: number;
  processFile: (file: File) => Promise<void>;
  reset: () => void;
}

export const usePdfToCsv = (): UsePdfToCsvReturn => {
  const [status, setStatus] = useState<AppState>(AppState.IDLE);
  const [result, setResult] = useState<CsvData | null>(null);
  const [fileMetadata, setFileMetadata] = useState<FileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [processTime, setProcessTime] = useState<number>(0);

  const processFile = useCallback(async (file: File) => {
    try {
      setStatus(AppState.PROCESSING);
      setError(null);
      setResult(null);

      // 1. Read File
      const data = await readFileAsBase64(file);
      setFileMetadata(data);

      // 2. Process with Gemini
      const startTime = performance.now();
      const csvText = await convertPdfToCsv(data.base64);
      const endTime = performance.now();
      setProcessTime((endTime - startTime) / 1000);

      // 3. Parse Result
      const parsedData = parseCSV(csvText);
      setResult(parsedData);
      
      setStatus(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setStatus(AppState.ERROR);
      setError(err.message || "An unexpected error occurred while processing the PDF.");
    }
  }, []);

  const reset = useCallback(() => {
    setStatus(AppState.IDLE);
    setResult(null);
    setFileMetadata(null);
    setError(null);
    setProcessTime(0);
  }, []);

  return {
    status,
    result,
    fileMetadata,
    error,
    processTime,
    processFile,
    reset
  };
};
