"use client";

import { useRef, useState } from "react";
import { Bot, Loader2, Send, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CashflowScenario, FinancialKpi } from "@/lib/schemas";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "Resume la salud financiera actual",
  "Que riesgos ves en el escenario pesimista?",
  "Como puedo extender el runway?"
];

interface CopilotChatProps {
  currentMetrics: FinancialKpi[];
  selectedScenario: CashflowScenario;
}

let messageCounter = 0;
function nextMessageId(): string {
  messageCounter += 1;
  return `msg-${Date.now()}-${messageCounter}`;
}

export function CopilotChat({ currentMetrics, selectedScenario }: CopilotChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: nextMessageId(),
      role: "assistant",
      content:
        "Hola, soy tu copiloto financiero. Preguntame sobre el runway, el burn rate o los escenarios de tesoreria proyectados."
    }
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function sendMessage(content: string) {
    const trimmed = content.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: ChatMessage = { id: nextMessageId(), role: "user", content: trimmed };
    const assistantId = nextMessageId();
    setMessages((prev) => [...prev, userMessage, { id: assistantId, role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({ id: m.id, role: m.role, content: m.content })),
          currentMetrics,
          selectedScenario
        })
      });

      if (!response.ok || !response.body) {
        throw new Error("El copiloto no respondio correctamente.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          const line = event.replace(/^data: /, "").trim();
          if (!line) continue;
          const parsed = JSON.parse(line) as { token?: string; done?: boolean };
          if (parsed.token) {
            appendToMessage(assistantId, parsed.token);
          }
        }
        scrollToBottom();
      }
    } catch {
      appendToMessage(assistantId, "Ocurrio un error al conectar con el copiloto financiero. Intenta nuevamente.");
    } finally {
      setIsStreaming(false);
    }
  }

  function appendToMessage(id: string, token: string) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, content: m.content + token } : m)));
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    });
  }

  return (
    <div className="flex h-full flex-col">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {isStreaming && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            El copiloto esta analizando los datos financieros...
          </div>
        )}
      </div>
      <div className="border-t border-border p-4">
        <div className="mb-3 flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => sendMessage(prompt)}
              disabled={isStreaming}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted disabled:opacity-50"
            >
              {prompt}
            </button>
          ))}
        </div>
        <form
          className="flex items-center gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
        >
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Pregunta sobre tus finanzas..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            disabled={isStreaming}
          />
          <Button type="submit" size="icon" disabled={isStreaming || input.trim().length === 0}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex items-start gap-2", isUser && "flex-row-reverse")}>
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-secondary" : "bg-primary/10"
        )}
      >
        {isUser ? <User className="h-3.5 w-3.5" /> : <Bot className="h-3.5 w-3.5 text-primary" />}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-3 py-2 text-sm",
          isUser ? "bg-secondary text-secondary-foreground" : "bg-muted text-foreground"
        )}
      >
        {message.content || <span className="text-muted-foreground">...</span>}
      </div>
    </div>
  );
}
