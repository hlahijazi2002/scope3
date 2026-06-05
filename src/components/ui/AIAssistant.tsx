import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Minimize2, Maximize2, Sparkles } from "lucide-react";
import { useAssessment } from "@/hooks/useAssessment";
import { SCOPE3_CATEGORIES } from "@/data/scope3Categories";
import { ApplicabilityStatus } from "@/types/assessment.types";

// TYPES

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// SUGGESTED QUESTIONS PER STEP

const SUGGESTIONS: Record<number, string[]> = {
  1: [
    "What is organizational boundary in GHG reporting?",
    "Which boundary approach is best for manufacturing?",
    "What reporting year should I use?",
  ],
  2: [
    "Which Scope 3 categories are most common for manufacturers?",
    "Does a service company need to report Scope 3?",
    "What does 'material' mean in Scope 3 context?",
  ],
  3: [
    "When should I mark a category as Not Applicable?",
    "What is the difference between Cat 1 and Cat 2?",
    "Is Category 15 required for all companies?",
  ],
  4: [
    "What is the spend-based method?",
    "How do I collect supplier-specific data?",
    "What data do I need for business travel?",
  ],
  5: [
    "What data readiness score is acceptable?",
    "Can I estimate data where it's unavailable?",
    "What is a proxy data approach?",
  ],
  6: [
    "What happens after I submit the assessment?",
    "Do I need to report all 15 categories?",
    "How do I improve my data readiness score?",
  ],
};

// SYSTEM PROMPT BUILDER

function buildSystemPrompt(
  state: ReturnType<typeof useAssessment>["state"],
): string {
  const applicable = SCOPE3_CATEGORIES.filter(
    (c) =>
      state.categoryResponses[c.id]?.applicability ===
      ApplicabilityStatus.APPLICABLE,
  )
    .map((c) => c.name)
    .join(", ");

  return `You are an expert GHG Protocol Scope 3 emissions advisor embedded in the URIMPACT platform.

Current assessment context:
- Company: ${state.companyProfile.name || "Not set"}
- Industry: ${state.companyProfile.industry || "Not set"}
- Country: ${state.companyProfile.country || "Not set"}
- Reporting Year: ${state.companyProfile.reportingYear}
- Current Step: ${state.currentStep} of 6
- Applicable Categories: ${applicable || "Not yet determined"}

Your role:
- Answer questions about GHG Protocol Scope 3 categories
- Help users understand applicability criteria
- Guide data collection methodology (spend-based, activity-based, supplier-specific)
- Provide practical advice tailored to the user's industry and context
- Be concise, clear, and actionable

Rules:
- Keep responses under 150 words
- Use bullet points for lists
- Always relate answers to the user's specific context when possible
- Do not make up emission factors or specific numbers
- If unsure, recommend consulting the GHG Protocol Technical Guidance`;
}

// MESSAGE BUBBLE

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* avatar */}
      {!isUser && (
        <div className="w-6 h-6 rounded-full bg-[#0F5F4B] flex items-center justify-center shrink-0 mt-0.5">
          <Bot size={12} className="text-white" />
        </div>
      )}

      {/* bubble */}
      <div
        className={`
          max-w-[85%] px-3 py-2.5 rounded-2xl text-[12px] leading-relaxed
          ${
            isUser
              ? "bg-[#0F5F4B] text-white rounded-tr-sm"
              : "bg-[#F3F4F6] text-[#1D1F21] rounded-tl-sm"
          }
        `}
      >
        {message.content.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < message.content.split("\n").length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  );
}

// TYPING INDICATOR

function TypingIndicator() {
  return (
    <div className="flex gap-2">
      <div className="w-6 h-6 rounded-full bg-[#0F5F4B] flex items-center justify-center shrink-0">
        <Bot size={12} className="text-white" />
      </div>
      <div className="bg-[#F3F4F6] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF] animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

// MAIN COMPONENT

export default function AIAssistant() {
  const { state } = useAssessment();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your Scope 3 AI advisor. I can help you understand GHG Protocol categories, data requirements, and applicability criteria. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = SUGGESTIONS[state.currentStep] ?? SUGGESTIONS[1];

  // auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // ── send message ──
  const sendMessage = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystemPrompt(state),
          messages: [
            ...messages
              .filter((m) => m.id !== "welcome")
              .map((m) => ({
                role: m.role,
                content: m.content,
              })),
            { role: "user", content },
          ],
        }),
      });

      const data = await response.json();
      const reply =
        data.content
          ?.map((c: { type: string; text?: string }) =>
            c.type === "text" ? c.text : "",
          )
          .filter(Boolean)
          .join("\n") ?? "Sorry, I couldn't process that. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Connection error. Please check your network and try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── FAB ── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full bg-[#0F5F4B] hover:bg-[#0a4a39] text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 flex items-center justify-center group"
        >
          <Bot size={22} />
          {/* pulse ring */}
          <span className="absolute w-full h-full rounded-full bg-[#1FA971]/30 animate-ping" />
        </button>
      )}

      {/* ── Chat window ── */}
      {isOpen && (
        <div
          className={`
            fixed bottom-6 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-[#E5E7EB]
            flex flex-col overflow-hidden transition-all duration-300
            ${isMinimized ? "w-75 h-13" : "w-90 h-130"}
          `}
        >
          {/* ── Header ── */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-[#0F5F4B] shrink-0">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Bot size={14} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-white leading-tight">
                Scope 3 AI Advisor
              </div>
              {!isMinimized && (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1FA971] animate-pulse" />
                  <span className="text-[10px] text-white/70">Online</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized((p) => !p)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                {isMinimized ? (
                  <Maximize2 size={13} className="text-white" />
                ) : (
                  <Minimize2 size={13} className="text-white" />
                )}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <X size={13} className="text-white" />
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          {!isMinimized && (
            <>
              {/* messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {loading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* suggestions */}
              {messages.length <= 1 && (
                <div className="px-4 pb-3">
                  <div className="flex items-center gap-1 mb-2">
                    <Sparkles size={11} className="text-[#9CA3AF]" />
                    <span className="text-[10px] text-[#9CA3AF] font-medium">
                      Suggested questions
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendMessage(s)}
                        className="text-left text-[11px] text-[#1FA971] bg-[#F3FBF7] border border-[#1FA971]/20 px-3 py-2 rounded-xl hover:bg-[#E8F7F0] transition-colors font-medium leading-snug"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* input */}
              <div className="px-3 pb-3 shrink-0">
                <div className="flex items-center gap-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl px-3 py-2 focus-within:border-[#1FA971] focus-within:ring-2 focus-within:ring-[#1FA971]/10 transition-all">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask about Scope 3..."
                    disabled={loading}
                    className="flex-1 bg-transparent text-[12px] text-[#1D1F21] placeholder-[#9CA3AF] outline-none font-['Poppins'] min-w-0"
                  />
                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                    className={`
                      w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all
                      ${
                        input.trim() && !loading
                          ? "bg-[#0F5F4B] text-white hover:bg-[#0a4a39]"
                          : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                      }
                    `}
                  >
                    <Send size={12} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
