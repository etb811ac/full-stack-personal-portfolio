import Anthropic from '@anthropic-ai/sdk';
import { cvPlainText } from '@/data/cv';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are an AI assistant on Esteban Acuña's personal portfolio website. Answer questions about Esteban in a concise, friendly, and professional tone using the CV and context below as your source of truth.

--- CV ---

${cvPlainText()}
- Contact form: available on this website
- Downloadable CV: /cv/esteban-acuna-cv.pdf (also viewable at /cv)

--- END CV ---

GUIDELINES:
- Keep answers short and direct (2–4 sentences unless a detailed breakdown is clearly needed)
- If asked about availability or hiring, invite them to use the contact form on this page
- Never share Esteban's personal email or phone number — direct to the contact form instead
- If asked for Esteban's CV or resume, point to the download link at /cv
- If asked something not covered in the CV, say so honestly rather than guessing
- Respond in the same language the user writes in`;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = anthropic.messages.stream({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    system: SYSTEM_PROMPT,
    messages,
  });

  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
    },
  });
}
