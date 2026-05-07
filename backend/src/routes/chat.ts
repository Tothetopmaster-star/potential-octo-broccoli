import { Router, Request, Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';

export const chatRouter = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

chatRouter.post('/chat', async (req: Request, res: Response) => {
    const { messages, model = 'claude-sonnet-4-20250514', temperature = 0.7, maxTokens = 4096 } = req.body as {
          messages: ChatMessage[];
          model?: string;
          temperature?: number;
          maxTokens?: number;
        };

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    try {
          const stream = await anthropic.messages.stream({
                  model,
                  max_tokens: maxTokens,
                  temperature,
                  system: 'You are Nova, a highly intelligent AI assistant. Be helpful, concise, and accurate.',
                  messages: messages.map(m => ({ role: m.role, content: m.content })),
                });

          for await (const chunk of stream) {
                  if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                            res.write(`data: ${JSON.stringify({ type: 'delta', text: chunk.delta.text })}\n\n`);
                          }
                }
          res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        } catch (err: any) {
          res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
        } finally {
          res.end();
        }
  });

chatRouter.post('/title', async (req: Request, res: Response) => {
    const { firstMessage } = req.body as { firstMessage: string };
    try {
          const response = await anthropic.messages.create({
                  model: 'claude-haiku-4-5-20251001',
                  max_tokens: 30,
                  messages: [{
                            role: 'user',
                            content: `Generate a short 3-5 word title for a conversation that starts with: "${firstMessage.slice(0, 200)}". Reply with only the title, no quotes, no punctuation.`
                          }]
                });
          const title = response.content[0].type === 'text' ? response.content[0].text.trim() : 'New conversation';
          res.json({ title });
        } catch {
          res.json({ title: firstMessage.slice(0, 40) });
        }
  });
