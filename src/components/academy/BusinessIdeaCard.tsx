import { RefreshCw, Bookmark, Lightbulb, Target, TrendingUp, Rocket, Shield, Users, DollarSign, Image } from "lucide-react";
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

export function BusinessIdeaCard({ data, loading, onRegenerate, onSave }: Props) {
  if (loading || !data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Today's Business Idea</span>
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
        <p className="text-sm text-primary font-medium">{data.oneLiner}</p>
      </CardHeader>
      <CardContent className="space-y-5">
        <Section icon={Target} title="Problem Statement">{data.problemStatement}</Section>
        <Section icon={Lightbulb} title="Solution">{data.solution}</Section>
        <Section icon={Users} title="Target Audience">{data.targetAudience}</Section>
        <Section icon={TrendingUp} title="Market Opportunity">{data.marketOpportunity}</Section>
        <Section icon={DollarSign} title="Revenue Model">{data.revenueModel}</Section>
        <Section icon={Rocket} title="MVP Plan">{data.mvpPlan}</Section>
        <Section icon={TrendingUp} title="Growth Strategy">{data.growthStrategy}</Section>
        <Section icon={Shield} title="Competitive Advantage">{data.competitiveAdvantage}</Section>
        <Section icon={Shield} title="Risks & Challenges">{data.risksAndChallenges}</Section>

        <div className="space-y-1.5">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Users className="h-4 w-4 text-primary" /> Example User Journey
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed italic">{data.exampleUserJourney}</p>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-sm font-semibold text-foreground">🎯 3 Immediate Action Steps</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
            {data.actionSteps?.map((s: string, i: number) => <li key={i}>{s}</li>)}
          </ol>
        </div>

        {data.visualSuggestions?.length > 0 && (
          <div className="space-y-1.5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Image className="h-4 w-4 text-primary" /> Visual Suggestions
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {data.visualSuggestions.map((v: string, i: number) => <li key={i}>{v}</li>)}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
