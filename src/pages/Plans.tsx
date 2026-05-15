import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Pin, PinOff, Trash2, Save, Calendar, Sparkles, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

type Horizon = "weekly" | "monthly" | "6month";

interface Plan {
  id: string;
  title: string;
  horizon: Horizon;
  content: string;
  start_date: string | null;
  pinned: boolean;
  created_at: string;
  updated_at: string;
}

const HORIZONS: { value: Horizon; label: string; emoji: string }[] = [
  { value: "weekly", label: "Weekly", emoji: "🗓️" },
  { value: "monthly", label: "Monthly", emoji: "📅" },
  { value: "6month", label: "6 Months", emoji: "🎯" },
];

export default function Plans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | Horizon>("all");
  const [editing, setEditing] = useState<Plan | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({
    title: "",
    horizon: "weekly" as Horizon,
    start_date: new Date().toISOString().slice(0, 10),
    content: "",
  });
  const [refining, setRefining] = useState(false);
  const [refiningEdit, setRefiningEdit] = useState(false);
  const [autoSaveAfterRefine, setAutoSaveAfterRefine] = useState(false);

  const refine = async (
    title: string,
    horizon: Horizon,
    content: string,
  ): Promise<string | null> => {
    if (!content.trim()) {
      toast.error("Write something first");
      return null;
    }
    const { data: { session } } = await supabase.auth.getSession();
    const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
    const url = `https://${projectId}.supabase.co/functions/v1/refine-plan`;
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.access_token || ""}`,
      },
      body: JSON.stringify({ title, horizon, content }),
    });
    const json = await resp.json();
    if (!resp.ok) {
      toast.error(json.error || "Refine failed");
      return null;
    }
    return json.refined as string;
  };

  const handleRefineDraft = async (saveAfter = false) => {
    setRefining(true);
    const refined = await refine(draft.title, draft.horizon, draft.content);
    setRefining(false);
    if (refined) {
      setDraft((d) => ({ ...d, content: refined }));
      toast.success("Plan refined ✨");
      if (saveAfter) setAutoSaveAfterRefine(true);
    }
  };

  useEffect(() => {
    if (autoSaveAfterRefine) {
      setAutoSaveAfterRefine(false);
      handleCreate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSaveAfterRefine]);

  const handleRefineEditing = async () => {
    if (!editing) return;
    setRefiningEdit(true);
    const refined = await refine(editing.title, editing.horizon, editing.content);
    setRefiningEdit(false);
    if (refined) {
      setEditing({ ...editing, content: refined });
      toast.success("Plan refined ✨");
    }
  };

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setPlans((data || []) as Plan[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const handleCreate = async () => {
    if (!user) return;
    if (!draft.title.trim() || !draft.content.trim()) {
      toast.error("Title and content required");
      return;
    }
    const { error } = await supabase.from("plans").insert({
      user_id: user.id,
      title: draft.title.trim(),
      horizon: draft.horizon,
      start_date: draft.start_date || null,
      content: draft.content,
    });
    if (error) return toast.error(error.message);
    toast.success("Plan added 🚀");
    setCreating(false);
    setDraft({ title: "", horizon: "weekly", start_date: new Date().toISOString().slice(0, 10), content: "" });
    load();
  };

  const handleUpdate = async () => {
    if (!editing) return;
    const { error } = await supabase
      .from("plans")
      .update({
        title: editing.title,
        horizon: editing.horizon,
        start_date: editing.start_date,
        content: editing.content,
      })
      .eq("id", editing.id);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setEditing(null);
    load();
  };

  const togglePin = async (p: Plan) => {
    await supabase.from("plans").update({ pinned: !p.pinned }).eq("id", p.id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    await supabase.from("plans").delete().eq("id", id);
    toast.success("Deleted");
    load();
  };

  const visible = filter === "all" ? plans : plans.filter((p) => p.horizon === filter);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-display text-2xl font-bold">Plans</h1>
              <p className="text-xs text-muted-foreground">Weekly · Monthly · 6-month roadmaps</p>
            </div>
          </div>
          <Button onClick={() => setCreating(true)} className="gap-1.5">
            <Plus className="h-4 w-4" /> New Plan
          </Button>
        </header>

        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {HORIZONS.map((h) => (
              <TabsTrigger key={h.value} value={h.value}>{h.emoji} {h.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {creating && (
          <Card className="mb-6 p-4">
            <h3 className="mb-3 font-semibold">New Plan</h3>
            <div className="space-y-3">
              <Input
                placeholder="Plan title (e.g. 7-Day Linked List Mastery)"
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              />
              <div className="flex flex-wrap gap-2">
                {HORIZONS.map((h) => (
                  <Button
                    key={h.value}
                    type="button"
                    size="sm"
                    variant={draft.horizon === h.value ? "default" : "outline"}
                    onClick={() => setDraft({ ...draft, horizon: h.value })}
                  >
                    {h.emoji} {h.label}
                  </Button>
                ))}
                <Input
                  type="date"
                  className="ml-auto w-auto"
                  value={draft.start_date}
                  onChange={(e) => setDraft({ ...draft, start_date: e.target.value })}
                />
              </div>
              <Textarea
                placeholder="Paste your full plan here (markdown / emoji / tables — anything)…"
                value={draft.content}
                onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                className="min-h-[300px] font-mono text-sm"
              />
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => handleRefineDraft(false)} variant="secondary" disabled={refining} className="gap-1.5">
                  {refining ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  {refining ? "Refining…" : "Refine with AI"}
                </Button>
                <Button onClick={() => handleRefineDraft(true)} variant="outline" disabled={refining} className="gap-1.5">
                  <Sparkles className="h-4 w-4" /> Refine & Save
                </Button>
                <Button onClick={handleCreate} className="gap-1.5">
                  <Save className="h-4 w-4" /> Save As-Is
                </Button>
                <Button variant="ghost" onClick={() => setCreating(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : visible.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-muted-foreground">No plans yet. Click <strong>New Plan</strong> and paste your roadmap.</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {visible.map((p) => {
              const isEditing = editing?.id === p.id;
              const horizon = HORIZONS.find((h) => h.value === p.horizon);
              return (
                <Card key={p.id} className="p-4">
                  {isEditing ? (
                    <div className="space-y-3">
                      <Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
                      <div className="flex flex-wrap gap-2">
                        {HORIZONS.map((h) => (
                          <Button key={h.value} type="button" size="sm"
                            variant={editing.horizon === h.value ? "default" : "outline"}
                            onClick={() => setEditing({ ...editing, horizon: h.value })}>
                            {h.emoji} {h.label}
                          </Button>
                        ))}
                        <Input type="date" className="ml-auto w-auto"
                          value={editing.start_date || ""}
                          onChange={(e) => setEditing({ ...editing, start_date: e.target.value })} />
                      </div>
                      <Textarea
                        value={editing.content}
                        onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                        className="min-h-[400px] font-mono text-sm"
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleUpdate} className="gap-1.5"><Save className="h-4 w-4" /> Save</Button>
                        <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            {p.pinned && <Pin className="h-4 w-4 text-primary" />}
                            <h3 className="font-display text-lg font-bold">{p.title}</h3>
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                              {horizon?.emoji} {horizon?.label}
                            </span>
                            {p.start_date && (
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {p.start_date}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => togglePin(p)} title="Pin">
                            {p.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setEditing(p)}>Edit</Button>
                          <Button variant="ghost" size="icon" onClick={() => remove(p.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap rounded-lg border border-border bg-muted/30 p-3 font-mono text-xs leading-relaxed text-foreground/90">
{p.content}
                      </pre>
                    </>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
