"use client";

import { useEffect, useState, useCallback } from "react";
import { learningApi, type Topic, type Subtopic } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { Loader2, PlusCircle, Edit2, ChevronDown, ChevronRight, Save, X } from "lucide-react";
import { toast } from "sonner";

export default function AdminTaxonomyPage() {
  const { token } = useAuthStore();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create / Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editingType, setEditingType] = useState<"topic" | "subtopic">("topic");
  const [editingItem, setEditingItem] = useState<Partial<Topic> | Partial<Subtopic> | null>(null);
  const [parentTopicId, setParentTopicId] = useState<string | null>(null);

  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());

  const fetchTopics = useCallback(() => {
    if (!token) return;
    setLoading(true);
    learningApi.getTopics(token)
      .then((res) => setTopics(res.items))
      .catch((err) => toast.error("Failed to load taxonomy: " + err.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const toggleExpand = (id: string) => {
    setExpandedTopics(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleCreateTopic = () => {
    setIsEditing(true);
    setEditingType("topic");
    setEditingItem({ name: "", slug: "", description: "", is_active: true, display_order: 0 });
    setParentTopicId(null);
  };

  const handleEditTopic = (topic: Topic) => {
    setIsEditing(true);
    setEditingType("topic");
    setEditingItem({ ...topic });
    setParentTopicId(null);
  };

  const handleCreateSubtopic = (topicId: string) => {
    setIsEditing(true);
    setEditingType("subtopic");
    setEditingItem({ name: "", slug: "", description: "", is_active: true, display_order: 0 });
    setParentTopicId(topicId);
  };

  const handleEditSubtopic = (subtopic: Subtopic, topicId: string) => {
    setIsEditing(true);
    setEditingType("subtopic");
    setEditingItem({ ...subtopic });
    setParentTopicId(topicId);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      if (editingType === "topic") {
        if (editingItem?.id) {
          await learningApi.admin.updateTopic(token, editingItem.id, editingItem);
          toast.success("Topic updated!");
        } else {
          await learningApi.admin.createTopic(token, editingItem as Partial<Topic>);
          toast.success("Topic created!");
        }
      } else {
        if (editingItem?.id) {
          await learningApi.admin.updateSubtopic(token, editingItem.id, editingItem);
          toast.success("Subtopic updated!");
        } else {
          if (!parentTopicId) throw new Error("Parent topic required");
          await learningApi.admin.createSubtopic(token, parentTopicId, editingItem as Partial<Subtopic>);
          toast.success("Subtopic created!");
        }
      }
      setIsEditing(false);
      fetchTopics();
    } catch (err: unknown) {
      toast.error("Error saving: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  if (loading && topics.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Taxonomy Management
          </h1>
          <p className="mt-2 text-ink/60">
            Manage Topics and Subtopics for learning content.
          </p>
        </div>
        <button
          onClick={handleCreateTopic}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <PlusCircle size={18} />
          New Topic
        </button>
      </div>

      {isEditing && editingItem && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">
              {editingItem.id ? "Edit" : "Create"} {editingType === "topic" ? "Topic" : "Subtopic"}
            </h2>
            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-ink/80">Name</label>
                <input
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-ink/80">Slug</label>
                <input
                  required
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  value={editingItem.slug}
                  onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink/80">Description</label>
              <textarea
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                value={editingItem.description || ""}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editingItem.is_active}
                  onChange={(e) => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm">
                Display Order:
                <input
                  type="number"
                  className="w-20 rounded-lg border border-slate-300 px-2 py-1"
                  value={editingItem.display_order || 0}
                  onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) || 0 })}
                />
              </label>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
              >
                <Save size={16} /> Save
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 p-4">
          {topics.map((topic) => (
            <div key={topic.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleExpand(topic.id)} className="text-slate-400 hover:text-slate-700">
                    {expandedTopics.has(topic.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                  <div>
                    <h3 className="font-bold text-ink">{topic.name} <span className="text-xs font-normal text-slate-400">/{topic.slug}</span></h3>
                    {topic.description && <p className="text-xs text-ink/60">{topic.description}</p>}
                  </div>
                  {!topic.is_active && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Inactive</span>}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleCreateSubtopic(topic.id)}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                  >
                    <PlusCircle size={14} /> Add Subtopic
                  </button>
                  <button
                    onClick={() => handleEditTopic(topic)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >
                    <Edit2 size={16} />
                  </button>
                </div>
              </div>
              
              {expandedTopics.has(topic.id) && (
                <div className="ml-8 mt-4 flex flex-col gap-2 border-l-2 border-slate-200 pl-4">
                  {topic.subtopics && topic.subtopics.length > 0 ? (
                    topic.subtopics.map(sub => (
                      <div key={sub.id} className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200/50">
                        <div>
                          <p className="text-sm font-medium text-ink">{sub.name} <span className="text-xs font-normal text-slate-400">/{sub.slug}</span></p>
                        </div>
                        <div className="flex gap-2 items-center">
                          {!sub.is_active && <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Inactive</span>}
                          <button
                            onClick={() => handleEditSubtopic(sub, topic.id)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          >
                            <Edit2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No subtopics.</p>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {topics.length === 0 && !loading && (
            <div className="p-8 text-center text-slate-500">
              No topics found. Create your first topic!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
