import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2, Flame, Coins, Mic2, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Msg = { role: "user" | "assistant"; content: string };
type Mode = "brutal" | "wealth" | "hanuman" | "comm";

const MODES: { id: Mode; label: string; icon: any; color: string }[] = [
  { id: "brutal",  label: "Brutal Mentor",  icon: Flame,    color: "text-destructive" },
  { id: "wealth",  label: "Wealth Coach",   icon: Coins,    color: "text-success" },
  { id: "hanuman", label: "Hanuman Guide",  icon: Sparkles, color: "text-warning" },
  { id: "comm",    label: "Speech Trainer", icon: Mic2,     color: "text-primary" },
];

interface Props { context?: any }

export function HanumanCoachChat({ context }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("brutal");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load history
  useEffect(() => {
    if (!user || !open) return;
    supabase
      .from("coach_messages")
      .select("role, content")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .limit(40)
      .then(({ data }) => { if (data) setMessages(data as Msg[]); });
  }, [user, open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  const send = async () => {
    if (!input.trim() || streaming || !user) return;
    const userMsg: Msg = { role: "user", content: input.trim() };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput("");
    setStreaming(true);

    // Persist user msg
    supabase.from("coach_messages").insert({ user_id: user.id, role: "user", content: userMsg.content, coach_mode: mode });

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const url = `https://${projectId}.supabase.co/functions/v1/hanuman-coach`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token || ""}`,
        },
        body: JSON.stringify({ messages: newMsgs, mode, context }),
      });

      if (!resp.ok || !resp.body) {
        const err = await resp.text();
        toast.error("Coach unavailable", { description: err.slice(0, 120) });
        setStreaming(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let assistant = "";
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      let buf = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() || "";
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith("data:")) continue;
          const payload = t.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const json = JSON.parse(payload);
            const delta = json.choices?.[0]?.delta?.content;
            if (delta) {
              assistant += delta;
              setMessages((m) => {
                const cp = [...m];
                cp[cp.length - 1] = { role: "assistant", content: assistant };
                return cp;
              });
            }
          } catch {}
        }
      }
      // Persist assistant msg
      if (assistant) {
        supabase.from("coach_messages").insert({ user_id: user.id, role: "assistant", content: assistant, coach_mode: mode });
      }
    } catch (e: any) {
      toast.error("Coach error", { description: e.message });
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-warning to-primary shadow-lg shadow-primary/40 transition hover:scale-110"
        aria-label="Open Hanuman Coach"
      >
        {open ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[70vh] max-h-[600px] w-[calc(100vw-2.5rem)] max-w-md flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="border-b border-border bg-gradient-to-r from-warning/10 to-primary/10 p-3">
            <p className="font-display text-sm font-bold text-foreground">Hanuman Coach 🚩</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {MODES.map((m) => {
                const Icon = m.icon;
                const active = m.id === mode;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id)}
                    className={cn(
                      "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold transition",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3 w-3" /> {m.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
            {messages.length === 0 && (
              <p className="text-center text-xs text-muted-foreground">
                Ask anything — "Roast me", "I feel an urge", "Plan my next 7 days", "Why did I slip?"
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm",
                  m.role === "user"
                    ? "ml-auto max-w-[85%] bg-primary text-primary-foreground"
                    : "mr-auto max-w-[90%] bg-muted text-foreground"
                )}
              >
                {m.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none break-words">
                    <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            ))}
            {streaming && messages[messages.length - 1]?.role === "user" && (
              <div className="mr-auto flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span className="text-xs text-muted-foreground">Coach is thinking…</span>
              </div>
            )}
          </div>

          <div className="border-t border-border p-2">
            <div className="flex gap-1.5">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                placeholder="Talk to your coach…"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                disabled={streaming}
              />
              <Button size="icon" onClick={send} disabled={streaming || !input.trim()} className="h-9 w-9 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
