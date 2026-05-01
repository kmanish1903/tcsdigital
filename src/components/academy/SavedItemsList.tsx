import { Trash2, Briefcase, Users, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const SECTION_ICONS: Record<string, any> = {
  business: Briefcase,
  influence: Users,
  conversation: MessageCircle,
};

const SECTION_LABELS: Record<string, string> = {
  business: "Business Idea",
  influence: "Influence Scenario",
  conversation: "Conversation Script",
};

interface Props {
  items: any[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export function SavedItemsList({ items, loading, onDelete }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No saved items yet. Browse the tabs and save content you like!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const Icon = SECTION_ICONS[item.section] || Briefcase;
        return (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <span>{item.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {SECTION_LABELS[item.section]}
                  </span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(item.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Saved on {new Date(item.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
              {/* Show a brief preview */}
              {item.content?.oneLiner && (
                <p className="mt-1 text-sm text-muted-foreground">{item.content.oneLiner}</p>
              )}
              {item.content?.situationSetup && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.content.situationSetup}</p>
              )}
              {item.content?.context && (
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.content.context}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
