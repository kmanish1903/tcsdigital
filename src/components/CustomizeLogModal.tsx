import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { GripVertical, Plus, Trash2, Loader as Loader2 } from "lucide-react";
import { CustomLogField, useCustomLogFields } from "@/hooks/useCustomLogFields";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SECTIONS = ["Learning", "Sadhana", "Discipline", "Speaking", "Fitness", "Focus", "Custom"];
const FIELD_TYPES: { value: CustomLogField["field_type"]; label: string }[] = [
  { value: "checkbox", label: "Checkbox (done/not done)" },
  { value: "number", label: "Number (count/minutes)" },
  { value: "text", label: "Text (notes/short text)" },
];
const PRIORITIES: { value: string; label: string }[] = [
  { value: "none", label: "None" },
  { value: "HIGH", label: "HIGH" },
  { value: "SADHANA", label: "SADHANA" },
];

export function CustomizeLogModal({ open, onClose }: Props) {
  const { fields, addField, deleteField, updateField, reorderFields } = useCustomLogFields();
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  // New field draft
  const [draft, setDraft] = useState<{
    label: string;
    field_key: string;
    field_type: CustomLogField["field_type"];
    unit: string;
    target: string;
    priority: string;
    section: string;
  }>({
    label: "",
    field_key: "",
    field_type: "checkbox",
    unit: "",
    target: "",
    priority: "none",
    section: "Custom",
  });

  const handleAdd = async () => {
    if (!draft.label.trim()) { toast.error("Label is required"); return; }
    const key = draft.field_key.trim() || draft.label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
    if (!key) { toast.error("Could not generate field key"); return; }
    if (fields.some((f) => f.field_key === key)) { toast.error("A field with this key already exists"); return; }
    setSaving(true);
    await addField({
      field_key: key,
      label: draft.label.trim(),
      field_type: draft.field_type,
      unit: draft.unit.trim() || null,
      target: draft.target ? parseInt(draft.target) : null,
      priority: (draft.priority as "HIGH" | "SADHANA") || null,
      sort_order: fields.length,
      section: draft.section,
    });
    setSaving(false);
    setAdding(false);
    setDraft({ label: "", field_key: "", field_type: "checkbox", unit: "", target: "", priority: "", section: "Custom" });
    toast.success("Field added");
  };

  const handleDelete = async (id: string) => {
    await deleteField(id);
    toast.success("Field removed");
  };

  const moveField = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= fields.length) return;
    const arr = [...fields];
    [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
    await reorderFields(arr);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Your Daily Log</DialogTitle>
          <DialogDescription>
            Add your own tracking fields. They'll appear as extra rows in your daily log, after the default sections.
          </DialogDescription>
        </DialogHeader>

        {/* Existing fields */}
        {fields.length > 0 && (
          <div className="space-y-2">
            <Label>Your Custom Fields</Label>
            {fields.map((f, i) => (
              <div key={f.id} className="flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-2.5">
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveField(i, -1)}
                    disabled={i === 0}
                    className="text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    &#9650;
                  </button>
                  <button
                    onClick={() => moveField(i, 1)}
                    disabled={i === fields.length - 1}
                    className="text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-30"
                  >
                    &#9660;
                  </button>
                </div>
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/50" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{f.label}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {f.field_type}{f.unit ? ` · ${f.unit}` : ""}{f.target ? ` · target ${f.target}` : ""}
                    {f.priority ? ` · ${f.priority}` : ""} · {f.section}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(f.id!)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {fields.length === 0 && !adding && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No custom fields yet. Add your own tracking items below.
          </p>
        )}

        {/* Add new field */}
        {adding ? (
          <div className="space-y-3 rounded-lg border border-primary/30 bg-primary/5 p-4">
            <h4 className="text-sm font-semibold text-foreground">Add New Field</h4>
            <div>
              <Label htmlFor="cf-label">Label</Label>
              <Input
                id="cf-label"
                placeholder="e.g. LeetCode Streak"
                value={draft.label}
                onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="cf-key">Field Key (auto-generated from label if blank)</Label>
              <Input
                id="cf-key"
                placeholder="e.g. leetcode_streak"
                value={draft.field_key}
                onChange={(e) => setDraft({ ...draft, field_key: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Type</Label>
                <Select value={draft.field_type} onValueChange={(v) => setDraft({ ...draft, field_type: v as CustomLogField["field_type"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FIELD_TYPES.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Section</Label>
                <Select value={draft.section} onValueChange={(v) => setDraft({ ...draft, section: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SECTIONS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label htmlFor="cf-unit">Unit</Label>
                <Input id="cf-unit" placeholder="min, reps, pages" value={draft.unit} onChange={(e) => setDraft({ ...draft, unit: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="cf-target">Target</Label>
                <Input id="cf-target" type="number" placeholder="e.g. 5" value={draft.target} onChange={(e) => setDraft({ ...draft, target: e.target.value })} />
              </div>
              <div>
                <Label>Priority</Label>
                <Select value={draft.priority} onValueChange={(v) => setDraft({ ...draft, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="ghost" onClick={() => setAdding(false)} size="sm">Cancel</Button>
              <Button onClick={handleAdd} disabled={saving} size="sm" className="gap-1.5">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                Add Field
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="outline" onClick={() => setAdding(true)} className="w-full gap-1.5">
            <Plus className="h-4 w-4" /> Add Custom Field
          </Button>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="ghost" onClick={onClose}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
