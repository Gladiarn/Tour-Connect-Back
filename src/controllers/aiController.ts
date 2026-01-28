import { callGeminiAPI } from '../services/aiServices.ts';

export const handleChat = async (req: any, res: any) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const aiResponse = await callGeminiAPI(message);

    res.json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error("controller error:", error);
    res.status(500).json({
      error: "Failed to process request",
      details: error,
    });
  }
};
