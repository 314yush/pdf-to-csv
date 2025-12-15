# PDF to CSV Converter Integration Guide

This module provides a fast, client-side PDF to CSV converter using Google's Gemini 2.5 Flash model. It is designed to be dropped into an existing React project.

## 1. Prerequisites

### Dependencies
You need to install the Google GenAI SDK:

```bash
npm install @google/genai
```

### Styling
The provided components use **Tailwind CSS**. Ensure your project is configured with Tailwind, or you will need to style the components manually.

## 2. File Integration

Copy the following files and folders into your project's source directory (e.g., `src/`):

1.  **`types.ts`** (Shared TypeScript interfaces)
2.  **`hooks/`**
    *   `usePdfToCsv.ts` (The core logic hook)
3.  **`services/`**
    *   `geminiService.ts` (API communication)
4.  **`utils/`**
    *   `fileUtils.ts` (File reading helpers)
    *   `csvUtils.ts` (CSV parsing helpers)
5.  **`components/`** (Optional: UI definitions)
    *   `FileUploader.tsx`
    *   `ResultPreview.tsx`

## 3. Environment Configuration

The `geminiService.ts` file expects an environment variable named `API_KEY`.

Create or update your `.env` file:

```env
# If using Vite
VITE_API_KEY=your_google_ai_studio_api_key

# If using Create React App / Webpack
REACT_APP_API_KEY=your_google_ai_studio_api_key

# If using Next.js
NEXT_PUBLIC_API_KEY=your_google_ai_studio_api_key
```

**Important:** Update `services/geminiService.ts` to match your framework's environment variable syntax if it differs from `process.env.API_KEY`.

## 4. Usage

You can use the `usePdfToCsv` hook to build your own UI, or use the provided components for a quick implementation.

### Example: Using the Custom Hook

```tsx
import React from 'react';
import { usePdfToCsv } from './hooks/usePdfToCsv';

const MyConverterComponent = () => {
  const { 
    status,        // 'IDLE' | 'PROCESSING' | 'SUCCESS' | 'ERROR'
    result,        // { headers: [], rows: [], rawText: "" }
    processFile,   // Function to trigger conversion
    error          // Error message string
  } = usePdfToCsv();

  const onFileChange = (e) => {
    if (e.target.files?.[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <input type="file" accept="application/pdf" onChange={onFileChange} />
      
      {status === 'PROCESSING' && <p>Converting...</p>}
      
      {status === 'ERROR' && <p style={{color: 'red'}}>{error}</p>}
      
      {status === 'SUCCESS' && result && (
        <pre>{result.rawText}</pre>
      )}
    </div>
  );
};
```

### Example: Using Provided Components

```tsx
import React from 'react';
import FileUploader from './components/FileUploader';
import ResultPreview from './components/ResultPreview';
import { usePdfToCsv } from './hooks/usePdfToCsv';

const FullPageConverter = () => {
  const { status, result, processFile, error } = usePdfToCsv();

  return (
    <div className="p-8">
      {status === 'IDLE' && (
         <FileUploader 
            onFileSelected={processFile} 
            isLoading={false} 
         />
      )}
      
      {status === 'PROCESSING' && <div>Loading...</div>}
      
      {status === 'SUCCESS' && result && (
         <ResultPreview data={result} />
      )}
    </div>
  );
};
```

## 5. Troubleshooting

*   **API Key Error:** If you see 401/403 errors, ensure your API Key is valid and has access to the `gemini-2.5-flash` model.
*   **CORS Issues:** The Gemini API supports CORS for browser-based requests, but ensure your local development server isn't blocking requests.
