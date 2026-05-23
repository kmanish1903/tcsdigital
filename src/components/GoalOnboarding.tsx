import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Target, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function GoalOnboarding({ open, onClose }: Props) {
  const { user } = useAuth();
  const { profile, updateProfile } = useProfile();
  const [title, setTitle] = useState(profile?.goal_title ?? "");
  const [desc, setDesc] = useState(profile?.goal_description ?? "");
  const [imageUrl, setImageUrl] = useState(profile?.goal_image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/goal-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("goal-images").upload(path, file, { upsert: true });
    if (error) {
      toast.error(error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("goal-images").getPublicUrl(path);
    setImageUrl(data.publicUrl);
    setUploading(false);
    toast.success("Image uploaded");
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please enter your goal");
      return;
    }
    setSaving(true);
    const err = await updateProfile({
      goal_title: title.trim(),
      goal_description: desc.trim() || null,
      goal_image_url: imageUrl || null,
    });
    setSaving(false);
    if (err) toast.error(err.message);
    else {
      toast.success("Goal saved 🎯");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" /> What's your big goal?
          </DialogTitle>
          <DialogDescription>
            Set the destination. We'll show it on your dashboard every day to keep you locked in.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <Label htmlFor="g-title">Your goal</Label>
            <Input
              id="g-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Land a 15 LPA SDE role"
              maxLength={120}
            />
          </div>

          <div>
            <Label htmlFor="g-desc">Why it matters (optional)</Label>
            <Textarea
              id="g-desc"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Financial freedom. Buy parents a house. Prove I can."
              rows={3}
            />
          </div>

          <div>
            <Label>Goal image</Label>
            <p className="mb-2 text-xs text-muted-foreground">
              A picture of your goal — dream home, dream car, family, salary slip… something that fires you up.
            </p>
            {imageUrl && (
              <img src={imageUrl} alt="Goal" className="mb-3 h-40 w-full rounded-lg border border-border object-cover" />
            )}
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card px-4 py-6 text-sm text-muted-foreground hover:bg-accent">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {uploading ? "Uploading…" : imageUrl ? "Replace image" : "Upload image"}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose}>Later</Button>
            <Button onClick={handleSave} disabled={saving || uploading}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save goal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
