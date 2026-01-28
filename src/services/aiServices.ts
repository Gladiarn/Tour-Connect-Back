import { GoogleGenerativeAI } from "@google/generative-ai";


export const callGeminiAPI = async (message: string) => {
  
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(message);

  const response = await result.response;
  return response.text();
};
