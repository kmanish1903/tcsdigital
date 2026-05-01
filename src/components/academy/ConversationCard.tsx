import { RefreshCw, Bookmark, MessageCircle, Brain, AlertTriangle, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentSkeleton } from "./ContentSkeleton";

interface Props {
  data: any;
  loading: boolean;
  onRegenerate: () => void;
  onSave: (title: string, data: any) => void;
}

export function ConversationCard({ data, loading, onRegenerate, onSave }: Props) {
  if (loading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Conversation Script</span>
            <Button variant="ghost" size="sm" onClick={onRegenerate} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent><ContentSkeleton /></CardContent>
      </Card>
    );
  }

  const flow = data.conversationFlow || {};

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="text-lg">{data.title}</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={onRegenerate}><RefreshCw className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => onSave(data.title, data)}>
              <Bookmark className="h-4 w-4" /> Save
            </Button>
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground"><strong>Context:</strong> {data.context}</p>
        <p className="text-sm text-primary font-medium"><strong>Goal:</strong> {data.goal}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Conversation Flow */}
        <div className="space-y-3">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessageCircle className="h-4 w-4 text-primary" /> Conversation Flow
          </h3>

          <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
            <p className="text-xs font-medium text-primary mb-1">Opening Line</p>
            <p className="text-sm text-foreground">"{flow.openingLine}"</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Follow-up Questions</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              {flow.followUpQuestions?.map((q: string, i: number) => <li key={i}>{q}</li>)}
            </ol>
          </div>

          <div className="rounded-lg border px-3 py-2">
            <p className="text-xs font-medium text-muted-foreground mb-1">Deep Conversation Transition</p>
            <p className="text-sm text-foreground italic">"{flow.deepTransition}"</p>
          </div>

          {flow.playfulLines?.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Playful / Confident Lines</p>
              {flow.playfulLines.map((l: string, i: number) => (
                <p key={i} className="text-sm text-foreground mb-1">"{l}"</p>
              ))}
            </div>
          )}

          <div className="rounded-lg border px-3 py-2">
            <p className="text-xs font-medium text-muted-foreground mb-1">Handling Silence</p>
            <p className="text-sm text-foreground">{flow.handlingSilence}</p>
          </div>

          <div className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
            <p className="text-xs font-medium text-primary mb-1">Strong Ending</p>
            <p className="text-sm text-foreground">"{flow.strongEnding}"</p>
          </div>
        </div>

        {/* Sample Conversation */}
        <div className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessageCircle className="h-4 w-4 text-primary" /> Full Sample Conversation
          </h3>
          <div className="space-y-2 rounded-xl border bg-muted/30 p-4">
            {data.sampleConversation?.map((msg: { speaker: string; line: string }, i: number) => (
              <div key={i} className={`flex ${msg.speaker === "You" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                  msg.speaker === "You"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border text-foreground"
                }`}>
                  <p className="text-xs font-medium opacity-70 mb-0.5">{msg.speaker}</p>
                  <p>{msg.line}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Psychology */}
        <div className="space-y-1.5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Brain className="h-4 w-4 text-primary" /> Psychology Breakdown
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{data.psychologyBreakdown}</p>
        </div>

        {/* Mistakes */}
        <div className="space-y-1.5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <AlertTriangle className="h-4 w-4 text-destructive" /> Mistakes to Avoid
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {data.mistakesToAvoid?.map((m: string, i: number) => <li key={i}>{m}</li>)}
          </ul>
        </div>

        {/* Practice Task */}
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
            <Target className="h-4 w-4 text-primary" /> Today's Practice Task
          </h3>
          <p className="text-sm text-foreground">{data.practiceTask}</p>
        </div>
      </CardContent>
    </Card>
  );
}
