"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { WorkshopSection } from "@/lib/types";
import { toast } from "sonner";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Hammer, Save, Plus, Trash2, GripVertical, Image,
  Video, LayoutGrid, FileText, Loader2, Lightbulb, X
} from "lucide-react";

// ─── Sortable Workshop Section ───

function SortableWorkshopSection({
  section,
  uploadingId,
  setUploadingId,
  updateSection,
  removeSection,
}: {
  section: WorkshopSection;
  uploadingId: string | null;
  setUploadingId: (id: string | null) => void;
  updateSection: (id: string, updates: Partial<WorkshopSection>) => void;
  removeSection: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const handleImageUpload = async (file: File, onSuccess: (url: string) => void) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setUploadingId(section.id);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "workshop");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        onSuccess(url);
      } else {
        toast.error("Failed to upload image");
      }
    } catch {
      toast.error("Failed to upload image");
    } finally {
      setUploadingId(null);
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      toast.error("Video must be under 50 MB");
      return;
    }
    setUploadingId(section.id);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "workshop");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        updateSection(section.id, { videoUrl: url });
      } else {
        toast.error("Failed to upload video");
      }
    } catch {
      toast.error("Failed to upload video");
    } finally {
      setUploadingId(null);
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="p-4">
        <div className="flex items-start gap-3">
          <button
            {...attributes}
            {...listeners}
            className="mt-2 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
          >
            <GripVertical className="w-5 h-5" />
          </button>
          <div className="flex-1">
            {/* ── Text ── */}
            {section.type === "text" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Text</Badge>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => removeSection(section.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Section title"
                  value={section.title || ""}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                />
                <Textarea
                  placeholder="Describe your workshop, process, or craft..."
                  value={section.content || ""}
                  rows={4}
                  onChange={(e) => updateSection(section.id, { content: e.target.value })}
                />
              </div>
            )}

            {/* ── Image ── */}
            {section.type === "image" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Image</Badge>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => removeSection(section.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                  {section.imageUrl ? (
                    <img src={section.imageUrl} alt="" className="w-full h-full object-cover rounded-lg" />
                  ) : uploadingId === section.id ? (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 mx-auto text-moulna-gold animate-spin mb-2" />
                      <p className="text-sm text-muted-foreground">Uploading...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Image className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleImageUpload(file, (url) => updateSection(section.id, { imageUrl: url }));
                          }}
                        />
                        <Button variant="outline" size="sm" asChild><span>Upload Image</span></Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">Max 5 MB &middot; JPG, PNG, or WebP</p>
                    </div>
                  )}
                </div>
                <Input
                  placeholder="Caption (optional)"
                  value={section.caption || ""}
                  onChange={(e) => updateSection(section.id, { caption: e.target.value })}
                />
              </div>
            )}

            {/* ── Video ── */}
            {section.type === "video" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Video</Badge>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => removeSection(section.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                  {section.videoUrl ? (
                    <video src={section.videoUrl} controls className="w-full h-full rounded-lg" />
                  ) : uploadingId === section.id ? (
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 mx-auto text-moulna-gold animate-spin mb-2" />
                      <p className="text-sm text-muted-foreground">Uploading...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Video className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleVideoUpload(file);
                          }}
                        />
                        <Button variant="outline" size="sm" asChild><span>Upload Video</span></Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">Max 50 MB &middot; MP4, WebM, or MOV</p>
                    </div>
                  )}
                </div>
                <Input
                  placeholder="Caption (optional)"
                  value={section.caption || ""}
                  onChange={(e) => updateSection(section.id, { caption: e.target.value })}
                />
              </div>
            )}

            {/* ── Gallery ── */}
            {section.type === "gallery" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Gallery</Badge>
                  <Button variant="ghost" size="icon" className="text-red-500" onClick={() => removeSection(section.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Gallery title (optional)"
                  value={section.title || ""}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                />
                <div className="grid grid-cols-3 gap-2">
                  {(section.images || []).map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => {
                          const updated = (section.images || []).filter((_, idx) => idx !== i);
                          updateSection(section.id, { images: updated });
                        }}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {(section.images || []).length < 9 && (
                    <div className="aspect-square bg-muted rounded-lg border-2 border-dashed flex items-center justify-center">
                      {uploadingId === section.id ? (
                        <Loader2 className="w-6 h-6 text-moulna-gold animate-spin" />
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleImageUpload(file, (url) => {
                                updateSection(section.id, { images: [...(section.images || []), url] });
                              });
                            }}
                          />
                          <Plus className="w-5 h-5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground mt-1">Add</span>
                        </label>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Up to 9 images &middot; Max 5 MB each &middot; JPG, PNG, or WebP</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Page ───

export default function WorkshopPage() {
  const [sections, setSections] = React.useState<WorkshopSection[]>([]);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [uploadingId, setUploadingId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections((prev) => {
        const oldIndex = prev.findIndex((s) => s.id === active.id);
        const newIndex = prev.findIndex((s) => s.id === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/seller/shop");
        if (res.ok) {
          const { shop } = await res.json();
          setSections(shop.workshopSections || []);
        }
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/seller/shop", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workshopSections: sections }),
      });
      if (res.ok) {
        toast.success("Workshop saved successfully");
      } else {
        toast.error("Failed to save workshop");
      }
    } catch {
      toast.error("Failed to save workshop");
    } finally {
      setIsSaving(false);
    }
  };

  const addSection = (type: WorkshopSection["type"]) => {
    setSections([...sections, {
      id: Date.now().toString(),
      type,
      title: "",
      content: "",
    }]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((s) => s.id !== id));
  };

  const updateSection = (id: string, updates: Partial<WorkshopSection>) => {
    setSections(sections.map((s) => s.id === id ? { ...s, ...updates } : s));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-moulna-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Hammer className="w-7 h-7 text-moulna-gold" />
            Workshop
          </h1>
          <p className="text-muted-foreground">
            Showcase your workspace, process, and craft
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-moulna-gold hover:bg-moulna-gold-dark"
        >
          {isSaving ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <Save className="w-4 h-4 me-2" />}
          {isSaving ? "Saving..." : "Save Workshop"}
        </Button>
      </div>

      {/* Tips */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">Tips for a great workshop page</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>Show behind-the-scenes photos of your workspace</li>
              <li>Add videos of your crafting or production process</li>
              <li>Use galleries to showcase materials, tools, or finished products</li>
              <li>Add descriptions to explain your techniques and passion</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Sections */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {sections.map((section) => (
            <SortableWorkshopSection
              key={section.id}
              section={section}
              uploadingId={uploadingId}
              setUploadingId={setUploadingId}
              updateSection={updateSection}
              removeSection={removeSection}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add Section */}
      <Card className="p-4 border-dashed">
        <p className="text-sm text-muted-foreground mb-3">Add a new section:</p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => addSection("image")}>
            <Image className="w-4 h-4 me-1" />
            Image
          </Button>
          <Button variant="outline" size="sm" onClick={() => addSection("video")}>
            <Video className="w-4 h-4 me-1" />
            Video
          </Button>
          <Button variant="outline" size="sm" onClick={() => addSection("gallery")}>
            <LayoutGrid className="w-4 h-4 me-1" />
            Gallery
          </Button>
          <Button variant="outline" size="sm" onClick={() => addSection("text")}>
            <FileText className="w-4 h-4 me-1" />
            Text
          </Button>
        </div>
      </Card>

      {sections.length === 0 && (
        <Card className="p-12 text-center">
          <Hammer className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">Your workshop is empty</h3>
          <p className="text-sm text-muted-foreground">
            Add images, videos, and galleries to showcase your craft and workspace.
          </p>
        </Card>
      )}
    </div>
  );
}
