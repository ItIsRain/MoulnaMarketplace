"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { StorySection, Milestone } from "@/lib/types";
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
  BookOpen, Save, Plus, Trash2, GripVertical, Image,
  Quote, Award, Heart, Lightbulb, Users, Star, Loader2,
  Heading, Minus, MessageSquareQuote, LayoutGrid, X, Info
} from "lucide-react";

function SortableSection({
  section,
  uploadingId,
  setUploadingId,
  updateSection,
  removeSection,
}: {
  section: StorySection;
  uploadingId: string | null;
  setUploadingId: (id: string | null) => void;
  updateSection: (id: string, updates: Partial<StorySection>) => void;
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
            {section.type === "text" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Text Section</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => removeSection(section.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Section Title"
                  value={section.title || ""}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                />
                <Textarea
                  placeholder="Write your story..."
                  value={section.content || ""}
                  rows={4}
                  onChange={(e) => updateSection(section.id, { content: e.target.value })}
                />
              </div>
            )}

            {section.type === "image" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Image</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => removeSection(section.id)}
                  >
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
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            if (file.size > 5 * 1024 * 1024) {
                              toast.error("Image must be under 5 MB");
                              return;
                            }
                            setUploadingId(section.id);
                            try {
                              const formData = new FormData();
                              formData.append("file", file);
                              formData.append("folder", "story");
                              const res = await fetch("/api/upload", { method: "POST", body: formData });
                              if (res.ok) {
                                const { url } = await res.json();
                                updateSection(section.id, { imageUrl: url });
                              } else {
                                toast.error("Failed to upload image");
                              }
                            } catch {
                              toast.error("Failed to upload image");
                            } finally {
                              setUploadingId(null);
                            }
                          }}
                        />
                        <Button variant="outline" size="sm" asChild>
                          <span>Upload Image</span>
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">Max 5 MB &middot; JPG, PNG, or WebP</p>
                    </div>
                  )}
                </div>
                <Input
                  placeholder="Image caption"
                  value={section.caption || ""}
                  onChange={(e) => updateSection(section.id, { caption: e.target.value })}
                />
              </div>
            )}

            {section.type === "quote" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Quote</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => removeSection(section.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="relative">
                  <Quote className="absolute left-3 top-3 w-5 h-5 text-moulna-gold" />
                  <Textarea
                    placeholder="Your inspirational quote..."
                    value={section.content || ""}
                    className="ps-12"
                    rows={3}
                    onChange={(e) => updateSection(section.id, { content: e.target.value })}
                  />
                </div>
                <Input
                  placeholder="Quote author"
                  value={section.author || ""}
                  onChange={(e) => updateSection(section.id, { author: e.target.value })}
                />
              </div>
            )}

            {section.type === "heading" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Heading</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => removeSection(section.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Section heading..."
                  value={section.title || ""}
                  onChange={(e) => updateSection(section.id, { title: e.target.value })}
                  className="text-lg font-semibold"
                />
              </div>
            )}

            {section.type === "divider" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Divider</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => removeSection(section.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-4 py-2">
                  <div className="flex-1 border-t border-muted-foreground/30" />
                  <span className="text-xs text-muted-foreground">Visual Divider</span>
                  <div className="flex-1 border-t border-muted-foreground/30" />
                </div>
              </div>
            )}

            {section.type === "callout" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Callout</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => removeSection(section.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="rounded-lg border-2 border-moulna-gold/30 bg-moulna-gold/5 p-4">
                  <Input
                    placeholder="Callout title (e.g., Did you know?)"
                    value={section.title || ""}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    className="border-none bg-transparent font-semibold p-0 h-auto mb-2 focus-visible:ring-0"
                  />
                  <Textarea
                    placeholder="Highlight something important about your brand..."
                    value={section.content || ""}
                    rows={3}
                    onChange={(e) => updateSection(section.id, { content: e.target.value })}
                    className="border-none bg-transparent p-0 focus-visible:ring-0 resize-none"
                  />
                </div>
              </div>
            )}

            {section.type === "gallery" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">Gallery</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500"
                    onClick={() => removeSection(section.id)}
                  >
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
                  {(section.images || []).length < 6 && (
                    <div className="aspect-square bg-muted rounded-lg border-2 border-dashed flex items-center justify-center">
                      {uploadingId === section.id ? (
                        <Loader2 className="w-6 h-6 text-moulna-gold animate-spin" />
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              if (file.size > 5 * 1024 * 1024) {
                                toast.error("Image must be under 5 MB");
                                return;
                              }
                              setUploadingId(section.id);
                              try {
                                const formData = new FormData();
                                formData.append("file", file);
                                formData.append("folder", "story");
                                const res = await fetch("/api/upload", { method: "POST", body: formData });
                                if (res.ok) {
                                  const { url } = await res.json();
                                  updateSection(section.id, { images: [...(section.images || []), url] });
                                } else {
                                  toast.error("Failed to upload image");
                                }
                              } catch {
                                toast.error("Failed to upload image");
                              } finally {
                                setUploadingId(null);
                              }
                            }}
                          />
                          <Plus className="w-5 h-5 text-muted-foreground" />
                          <span className="text-[10px] text-muted-foreground mt-1">Add</span>
                        </label>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Up to 6 images &middot; Max 5 MB each &middot; JPG, PNG, or WebP</p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function ShopStoryPage() {
  const [sections, setSections] = React.useState<StorySection[]>([]);
  const [milestones, setMilestones] = React.useState<Milestone[]>([]);
  const [coreValues, setCoreValues] = React.useState<string[]>([]);
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
    async function loadShop() {
      try {
        const res = await fetch("/api/seller/shop");
        if (res.ok) {
          const { shop } = await res.json();
          setSections(shop.storySections || []);
          setMilestones(shop.milestones || []);
          setCoreValues(shop.coreValues?.length ? shop.coreValues : [""]);
        }
      } finally {
        setIsLoading(false);
      }
    }
    loadShop();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/seller/shop", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storySections: sections,
          milestones,
          coreValues: coreValues.filter(Boolean),
        }),
      });
      if (res.ok) {
        toast.success("Story saved successfully");
      } else {
        toast.error("Failed to save story");
      }
    } catch {
      toast.error("Failed to save story");
    } finally {
      setIsSaving(false);
    }
  };

  const addSection = (type: string) => {
    const newSection: StorySection = {
      id: Date.now().toString(),
      type: type as StorySection["type"],
      title: "",
      content: "",
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const updateSection = (id: string, updates: Partial<StorySection>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const addMilestone = () => {
    setMilestones([...milestones, { year: "", title: "", description: "" }]);
  };

  const updateMilestone = (index: number, updates: Partial<Milestone>) => {
    setMilestones(milestones.map((m, i) => i === index ? { ...m, ...updates } : m));
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
            <BookOpen className="w-7 h-7 text-moulna-gold" />
            Shop Story
          </h1>
          <p className="text-muted-foreground">
            Tell your brand story and connect with customers
          </p>
        </div>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-moulna-gold hover:bg-moulna-gold-dark"
        >
          {isSaving ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : <Save className="w-4 h-4 me-2" />}
          {isSaving ? "Saving..." : "Save Story"}
        </Button>
      </div>

      {/* Tips */}
      <Card className="p-4 bg-moulna-charcoal dark:bg-moulna-charcoal-dark border-moulna-charcoal-light/30">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-moulna-gold mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-white">Tips for a great story</p>
            <ul className="text-sm text-white/70 mt-1 space-y-1">
              <li>Share your passion and what makes your shop unique</li>
              <li>Include photos of your workspace, team, or process</li>
              <li>Tell customers about your values and mission</li>
              <li>Add milestones to show your journey</li>
              <li>Story images: <span className="text-moulna-gold font-medium">1200 × 800px</span> recommended</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Story Editor */}
        <div className="lg:col-span-2 space-y-4">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => (
                <SortableSection
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

          {/* Add Section Buttons */}
          <Card className="p-4 border-dashed">
            <p className="text-sm text-muted-foreground mb-3">Add a new section:</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => addSection("heading")}>
                <Heading className="w-4 h-4 me-1" />
                Heading
              </Button>
              <Button variant="outline" size="sm" onClick={() => addSection("text")}>
                <Plus className="w-4 h-4 me-1" />
                Text
              </Button>
              <Button variant="outline" size="sm" onClick={() => addSection("image")}>
                <Image className="w-4 h-4 me-1" />
                Image
              </Button>
              <Button variant="outline" size="sm" onClick={() => addSection("gallery")}>
                <LayoutGrid className="w-4 h-4 me-1" />
                Gallery
              </Button>
              <Button variant="outline" size="sm" onClick={() => addSection("quote")}>
                <MessageSquareQuote className="w-4 h-4 me-1" />
                Quote
              </Button>
              <Button variant="outline" size="sm" onClick={() => addSection("callout")}>
                <Info className="w-4 h-4 me-1" />
                Callout
              </Button>
              <Button variant="outline" size="sm" onClick={() => addSection("divider")}>
                <Minus className="w-4 h-4 me-1" />
                Divider
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Milestones */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold flex items-center gap-2">
                <Award className="w-5 h-5 text-moulna-gold" />
                Milestones
              </h2>
              <Button variant="ghost" size="sm" onClick={addMilestone}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-14 flex-shrink-0">
                    <Input
                      value={milestone.year}
                      onChange={(e) => updateMilestone(index, { year: e.target.value })}
                      placeholder="Year"
                      className="text-xs text-center p-1"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Input
                      value={milestone.title}
                      onChange={(e) => updateMilestone(index, { title: e.target.value })}
                      placeholder="Title"
                      className="text-sm h-8"
                    />
                    <Input
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, { description: e.target.value })}
                      placeholder="Description"
                      className="text-xs h-7"
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Values */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-moulna-gold" />
              Core Values
            </h2>
            <div className="space-y-2">
              {coreValues.map((value, index) => (
                <Input
                  key={index}
                  value={value}
                  onChange={(e) => {
                    const updated = [...coreValues];
                    updated[index] = e.target.value;
                    setCoreValues(updated);
                  }}
                  placeholder={`e.g., ${["Authenticity", "Quality", "Sustainability"][index] || "Value"}`}
                />
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-2"
                onClick={() => setCoreValues([...coreValues, ""])}
              >
                <Plus className="w-4 h-4 me-1" />
                Add Value
              </Button>
            </div>
          </Card>

          {/* Team */}
          <Card className="p-6">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-moulna-gold" />
              Meet the Team
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Introduce your team members to build trust with customers.
            </p>
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 me-1" />
              Add Team Member
            </Button>
          </Card>

          {/* Preview Stats */}
          <Card className="p-6 bg-gradient-to-br from-moulna-gold/10 to-amber-50">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-moulna-gold" />
              Story Stats
            </h2>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-moulna-gold">{sections.length}</p>
                <p className="text-xs text-muted-foreground">Sections</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-moulna-gold">{milestones.length}</p>
                <p className="text-xs text-muted-foreground">Milestones</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
