import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const convertPdfToCsv = async (base64Data: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'application/pdf',
              data: base64Data
            }
          },
          {
            text: `You are a precise data extraction engine. 
            Analyze the provided PDF document. 
            Extract all tabular data or structured lists found in the document.
            Convert this data into a valid, standard CSV format.
            
            Rules:
            1. Output ONLY the CSV data.
            2. Do not include markdown code blocks (like \`\`\`csv ... \`\`\`).
            3. Do not include any introductory or concluding text.
            4. If there are multiple tables, merge them if the columns align, or separate them with a blank line.
            5. Ensure headers are accurate based on the PDF content.
            6. Handle special characters by wrapping fields in double quotes if necessary.
            
            If no tabular data is found, return an empty string.`
          }
        ]
      }
    });

    let text = response.text || '';
    
    // Cleanup: Remove markdown code blocks if the model ignores the instruction
    text = text.replace(/^```csv\s*/i, '').replace(/^```\s*/i, '').replace(/```$/g, '');
    
    return text.trim();
  } catch (error) {
    console.error("Error converting PDF to CSV:", error);
    throw error;
  }
};
