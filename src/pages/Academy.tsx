import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, Users, MessageCircle, Bookmark } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BusinessIdeaCard } from "@/components/academy/BusinessIdeaCard";
import { InfluenceCard } from "@/components/academy/InfluenceCard";
import { ConversationCard } from "@/components/academy/ConversationCard";
import { SavedItemsList } from "@/components/academy/SavedItemsList";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Section = "business" | "influence" | "conversation";

export default function Academy() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<string>("business");
  const [content, setContent] = useState<Record<Section, any>>({
    business: null, influence: null, conversation: null,
  });
  const [loading, setLoading] = useState<Record<Section, boolean>>({
    business: false, influence: false, conversation: false,
  });
  const [savedItems, setSavedItems] = useState<any[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);

  const fetchContent = useCallback(async (section: Section) => {
    setLoading((p) => ({ ...p, [section]: true }));
    try {
      const { data, error } = await supabase.functions.invoke("academy-content", {
        body: { section },
      });
      if (error) throw error;
      if (data?.data) {
        setContent((p) => ({ ...p, [section]: data.data }));
      } else if (data?.error) {
        toast.error(data.error);
      }
    } catch (e: any) {
      toast.error(e.message || "Failed to load content");
    } finally {
      setLoading((p) => ({ ...p, [section]: false }));
    }
  }, []);

  const fetchSaved = useCallback(async () => {
    if (!user) return;
    setSavedLoading(true);
    const { data } = await supabase
      .from("saved_academy_items")
      .select("*")
      .order("created_at", { ascending: false });
    setSavedItems(data || []);
    setSavedLoading(false);
  }, [user]);

  useEffect(() => {
    if (tab === "saved") {
      fetchSaved();
    } else if (!content[tab as Section] && !loading[tab as Section]) {
      fetchContent(tab as Section);
    }
  }, [tab]);

  const handleSave = async (section: Section, title: string, data: any) => {
    if (!user) return;
    const { error } = await supabase.from("saved_academy_items").insert({
      user_id: user.id,
      section,
      title,
      content: data,
    });
    if (error) {
      toast.error("Failed to save");
    } else {
      toast.success("Saved to your collection! 🔖");
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("saved_academy_items").delete().eq("id", id);
    if (error) toast.error("Failed to delete");
    else {
      setSavedItems((p) => p.filter((i) => i.id !== id));
      toast.success("Removed");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        <header className="mb-6 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight">
              Daily <span className="text-primary">Academy</span>
            </h1>
            <p className="text-sm text-muted-foreground">Fresh content every day — Business, Influence, Conversation</p>
          </div>
        </header>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-4">
            <TabsTrigger value="business" className="gap-1.5 text-xs sm:text-sm">
              <Briefcase className="h-3.5 w-3.5" /> Business
            </TabsTrigger>
            <TabsTrigger value="influence" className="gap-1.5 text-xs sm:text-sm">
              <Users className="h-3.5 w-3.5" /> Influence
            </TabsTrigger>
            <TabsTrigger value="conversation" className="gap-1.5 text-xs sm:text-sm">
              <MessageCircle className="h-3.5 w-3.5" /> Conversation
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-1.5 text-xs sm:text-sm">
              <Bookmark className="h-3.5 w-3.5" /> Saved
            </TabsTrigger>
          </TabsList>

          <TabsContent value="business">
            <BusinessIdeaCard
              data={content.business}
              loading={loading.business}
              onRegenerate={() => fetchContent("business")}
              onSave={(title, data) => handleSave("business", title, data)}
            />
          </TabsContent>

          <TabsContent value="influence">
            <InfluenceCard
              data={content.influence}
              loading={loading.influence}
              onRegenerate={() => fetchContent("influence")}
              onSave={(title, data) => handleSave("influence", title, data)}
            />
          </TabsContent>

          <TabsContent value="conversation">
            <ConversationCard
              data={content.conversation}
              loading={loading.conversation}
              onRegenerate={() => fetchContent("conversation")}
              onSave={(title, data) => handleSave("conversation", title, data)}
            />
          </TabsContent>

          <TabsContent value="saved">
            <SavedItemsList items={savedItems} loading={savedLoading} onDelete={handleDelete} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
