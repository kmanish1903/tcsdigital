import { RefreshCw, Bookmark, Zap, Brain, Footprints, MessageSquare, AlertTriangle, Star, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContentSkeleton } from "./ContentSkeleton";

interface Props {
  data: any;
  loading: boolean;
  onRegenerate: () => void;
  onSave: (title: string, data: any) => void;
}

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="h-4 w-4 text-primary" /> {title}
      </h3>
      <div className="text-sm text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

export function InfluenceCard({ data, loading, onRegenerate, onSave }: Props) {
  if (loading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Influence Scenario</span>
            <Button variant="ghost" size="sm" onClick={onRegenerate} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent><ContentSkeleton /></CardContent>
      </Card>
    );
  }

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
      </CardHeader>
      <CardContent className="space-y-5">
        <Section icon={Zap} title="Situation Setup">{data.situationSetup}</Section>
        <Section icon={AlertTriangle} title="The Challenge">{data.challenge}</Section>
        <Section icon={Brain} title="Ideal Mindset">{data.idealMindset}</Section>

        <div className="space-y-1.5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Footprints className="h-4 w-4 text-primary" /> Step-by-Step Action Plan
          </h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            {data.actionPlan?.map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ol>
        </div>

        <div className="space-y-1.5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MessageSquare className="h-4 w-4 text-primary" /> Exact Words to Say
          </h3>
          <div className="space-y-2">
            {data.exactWords?.map((line: string, i: number) => (
              <p key={i} className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-sm font-medium text-foreground">
                "{line}"
              </p>
            ))}
          </div>
        </div>

        <Section icon={Zap} title="Body Language & Tone">{data.bodyLanguageAndTone}</Section>

        <div className="space-y-1.5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <AlertTriangle className="h-4 w-4 text-destructive" /> Mistakes to Avoid
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {data.mistakesToAvoid?.map((m: string, i: number) => <li key={i}>{m}</li>)}
          </ul>
        </div>

        <Section icon={Star} title="Advanced Move (Top 1% Behavior)">{data.advancedMove}</Section>

        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
            <HelpCircle className="h-4 w-4 text-primary" /> Reflection Question
          </h3>
          <p className="text-sm text-foreground italic">{data.reflectionQuestion}</p>
        </div>
      </CardContent>
    </Card>
  );
}
