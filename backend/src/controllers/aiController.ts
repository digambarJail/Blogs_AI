import { Request, Response } from 'express';
import axios from 'axios';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const promptWrapper = (task: string, content: string) => {
  switch (task) {
    case 'suggest_title':
      return `Suggest a catchy blog post title for the following content:\n${content}`;
    case 'summarize':
      return `Summarize the following blog post:\n${content}`;
    case 'improve':
      return `Improve the writing style of this blog post content:\n${content}`;
    default:
      return content;
  }
};

export const generateAIContent = async (req: Request, res: Response) => {
  const { task, content } = req.body;

  if (!task || !content) {
    return res.status(400).json({ error: 'Task and content are required' });
  }

  const prompt = promptWrapper(task, content);

  try {
    const response = await axios.post(
      `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No response from Gemini AI');

    res.json({ result: text });
  } catch (err: any) {
    res.status(500).json({
      error: 'AI request failed',
      details: err?.response?.data?.error?.message || err.message,
    });
  }
};
