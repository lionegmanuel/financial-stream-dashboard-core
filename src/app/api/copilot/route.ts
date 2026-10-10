import type { NextRequest } from "next/server";

import { buildCopilotAnalysis } from "@/lib/copilot-engine";
import { CopilotRequestSchema } from "@/lib/schemas";

export const runtime = "nodejs";

const TOKEN_DELAY_MS = process.env.NODE_ENV === "test" ? 1 : 30;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: NextRequest): Promise<Response> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("El cuerpo de la solicitud debe ser JSON valido.", 400);
  }

  const parsed = CopilotRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError("Payload invalido para el copiloto financiero.", 400, parsed.error.issues);
  }

  const { messages, currentMetrics, selectedScenario } = parsed.data;
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");
  const analysisText = buildCopilotAnalysis(currentMetrics, selectedScenario, lastUserMessage?.content ?? "");

  const encoder = new TextEncoder();
  const words = analysisText.split(" ");

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for (const word of words) {
          const event = `data: ${JSON.stringify({ token: `${word} ` })}\n\n`;
          controller.enqueue(encoder.encode(event));
          await delay(TOKEN_DELAY_MS);
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
      } catch (streamError) {
        const errorMsg = streamError instanceof Error ? streamError.message : "Error durante el streaming";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`));
        controller.close();
      }
    }
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no"
    }
  });
}

function jsonError(message: string, status: number, details?: unknown): Response {
  return new Response(
    JSON.stringify({
      error: message,
      ...(details ? { details } : {})
    }),
    {
      status,
      headers: { "Content-Type": "application/json" }
    }
  );
}
