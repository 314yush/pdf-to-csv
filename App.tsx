import React from 'react';
import FileUploader from './components/FileUploader';
import ResultPreview from './components/ResultPreview';
import { formatFileSize } from './utils/fileUtils';
import { downloadCsvFile } from './utils/csvUtils';
import { AppState } from './types';
import { usePdfToCsv } from './hooks/usePdfToCsv';

const App: React.FC = () => {
  const { 
    status, 
    result, 
    fileMetadata, 
    error, 
    processTime, 
    processFile, 
    reset 
  } = usePdfToCsv();

  const handleDownload = () => {
    if (result && fileMetadata) {
      const fileName = fileMetadata.name.replace(/\.pdf$/i, '') + '_converted.csv';
      downloadCsvFile(result.rawText, fileName);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-50 text-slate-900 pb-20">
      
      {/* Header */}
      <header className="w-full bg-white border-b border-slate-200 py-6 mb-10 shadow-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={reset}>
                <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-800">PDF to CSV <span className="text-indigo-600">Transcriber</span></h1>
                    <p className="text-xs text-slate-500 font-medium">Powered by Gemini 2.5 Flash</p>
                </div>
            </div>
            
            {status === AppState.SUCCESS && (
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Download CSV
                </button>
            )}
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl px-4 flex-grow">
        
        {/* Intro Text (only when Idle) */}
        {status === AppState.IDLE && (
            <div className="text-center mb-10 max-w-2xl mx-auto">
                <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                    Convert Data in Seconds
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                    Upload any PDF document containing tables, lists, or structured data. 
                    Our AI will instantly transcribe it into a clean, downloadable CSV file.
                </p>
            </div>
        )}

        {/* Uploader Section */}
        {status === AppState.IDLE && (
            <FileUploader onFileSelected={processFile} isLoading={false} />
        )}

        {/* Processing State */}
        {status === AppState.PROCESSING && (
            <div className="w-full max-w-2xl mx-auto py-12 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Transcribing Document...</h3>
                <p className="text-slate-500 mb-6">Analyzing structure and extracting data.</p>
                {fileMetadata && (
                    <div className="bg-slate-50 px-4 py-2 rounded-full text-sm text-slate-600 border border-slate-200 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        {fileMetadata.name} <span className="text-slate-300">|</span> {formatFileSize(fileMetadata.size)}
                    </div>
                )}
            </div>
        )}

        {/* Error State */}
        {status === AppState.ERROR && (
             <div className="w-full max-w-2xl mx-auto py-12 flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-red-100">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Conversion Failed</h3>
                <p className="text-red-500 mb-8 text-center max-w-md">{error}</p>
                <button 
                    onClick={reset}
                    className="bg-slate-800 text-white px-6 py-2.5 rounded-lg hover:bg-slate-900 transition-colors"
                >
                    Try Another File
                </button>
             </div>
        )}

        {/* Success State */}
        {status === AppState.SUCCESS && result && fileMetadata && (
            <div className="animate-fade-in-up">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
                     <div className="flex items-center gap-3">
                         <div className="p-3 bg-green-100 text-green-700 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                         </div>
                         <div>
                             <h3 className="font-bold text-slate-800">Conversion Complete</h3>
                             <p className="text-sm text-slate-500">{fileMetadata.name} ({formatFileSize(fileMetadata.size)}) • {processTime.toFixed(2)}s</p>
                         </div>
                     </div>
                     <div className="flex gap-3">
                        <button onClick={reset} className="text-sm text-slate-500 hover:text-indigo-600 font-medium px-3 py-2">
                            Convert Another
                        </button>
                     </div>
                </div>

                <ResultPreview data={result} />
            </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-auto py-8 text-center text-slate-400 text-sm">
        <p>Gemini AI • React • Tailwind</p>
      </footer>

    </div>
  );
};

export default App;
