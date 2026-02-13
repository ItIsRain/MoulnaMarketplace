"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen, Save, Plus, Trash2, GripVertical, Image,
  Video, Quote, Award, Heart, Lightbulb, Users, Star
} from "lucide-react";

const STORY_SECTIONS = [
  {
    id: "1",
    type: "text",
    title: "Our Beginning",
    content: "Arabian Scents was born from a passion for traditional Arabian perfumery. In 2010, we started as a small family business in the heart of Dubai's historic perfume souq...",
  },
  {
    id: "2",
    type: "image",
    title: "Our Workshop",
    imageUrl: "/story/workshop.jpg",
    caption: "Where the magic happens - our traditional perfume blending workshop",
  },
  {
    id: "3",
    type: "quote",
    content: "Every fragrance tells a story, and we're here to help you tell yours.",
    author: "Fatima Al-Hassan, Founder",
  },
  {
    id: "4",
    type: "text",
    title: "Our Mission",
    content: "We believe in preserving the ancient art of Arabian perfumery while making it accessible to a new generation. Each product is crafted with care, using techniques passed down through generations.",
  },
];

const MILESTONES = [
  { year: "2010", title: "Shop Founded", description: "Started in Dubai Souq" },
  { year: "2015", title: "First Award", description: "Best Artisan Perfumer" },
  { year: "2020", title: "Joined Moulna", description: "Expanded online presence" },
  { year: "2024", title: "10K+ Customers", description: "Growing community" },
];

export default function ShopStoryPage() {
  const [sections, setSections] = React.useState(STORY_SECTIONS);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const addSection = (type: string) => {
    const newSection = {
      id: Date.now().toString(),
      type,
      title: "",
      content: "",
    };
    setSections([...sections, newSection]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

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
          <Save className="w-4 h-4 me-2" />
          {isSaving ? "Saving..." : "Save Story"}
        </Button>
      </div>

      {/* Tips */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <p className="font-medium text-blue-800">Tips for a great story</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Share your passion and what makes your shop unique</li>
              <li>• Include photos of your workspace, team, or process</li>
              <li>• Tell customers about your values and mission</li>
              <li>• Add milestones to show your journey</li>
            </ul>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Story Editor */}
        <div className="lg:col-span-2 space-y-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <button className="mt-2 cursor-grab text-muted-foreground hover:text-foreground">
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
                          value={section.title}
                          onChange={(e) => {
                            const updated = sections.map(s =>
                              s.id === section.id ? { ...s, title: e.target.value } : s
                            );
                            setSections(updated);
                          }}
                        />
                        <Textarea
                          placeholder="Write your story..."
                          value={section.content}
                          rows={4}
                          onChange={(e) => {
                            const updated = sections.map(s =>
                              s.id === section.id ? { ...s, content: e.target.value } : s
                            );
                            setSections(updated);
                          }}
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
                          <div className="text-center">
                            <Image className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                            <Button variant="outline" size="sm">
                              Upload Image
                            </Button>
                          </div>
                        </div>
                        <Input placeholder="Image caption" />
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
                            value={section.content}
                            className="ps-12"
                            rows={3}
                          />
                        </div>
                        <Input placeholder="Quote author" />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Add Section Buttons */}
          <Card className="p-4 border-dashed">
            <p className="text-sm text-muted-foreground mb-3">Add a new section:</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => addSection("text")}>
                <Plus className="w-4 h-4 me-1" />
                Text
              </Button>
              <Button variant="outline" size="sm" onClick={() => addSection("image")}>
                <Image className="w-4 h-4 me-1" />
                Image
              </Button>
              <Button variant="outline" size="sm" onClick={() => addSection("quote")}>
                <Quote className="w-4 h-4 me-1" />
                Quote
              </Button>
              <Button variant="outline" size="sm" onClick={() => addSection("video")}>
                <Video className="w-4 h-4 me-1" />
                Video
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
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {MILESTONES.map((milestone, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg bg-moulna-gold/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-moulna-gold">{milestone.year}</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{milestone.title}</p>
                    <p className="text-xs text-muted-foreground">{milestone.description}</p>
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
              <Input placeholder="e.g., Authenticity" className="mb-2" />
              <Input placeholder="e.g., Quality" className="mb-2" />
              <Input placeholder="e.g., Sustainability" />
              <Button variant="outline" size="sm" className="w-full mt-2">
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
                <p className="text-2xl font-bold text-moulna-gold">2.4K</p>
                <p className="text-xs text-muted-foreground">Story Views</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-moulna-gold">89%</p>
                <p className="text-xs text-muted-foreground">Engagement</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
