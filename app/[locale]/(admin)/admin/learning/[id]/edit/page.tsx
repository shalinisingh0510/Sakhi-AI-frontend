"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import {
  learningApi,
  type ContentType,
  type SourceType,
  type ContentBlock,
  type LearningContentCreateInput,
} from "@/lib/api";
import { Loader2, Plus, Trash2, ChevronUp, ChevronDown, ArrowLeft, Eye, Edit2 } from "lucide-react";
import Link from "next/link";
import { AdminMediaUploader } from "@/components/admin/AdminMediaUploader";
import { LearningArticleRenderer, calculateReadingTime } from "@/components/learning/LearningArticleRenderer";
import { LearningVideoPlayer } from "@/components/learning/LearningVideoPlayer";

const CATEGORIES = [
  "menstrual-health",
  "puberty-basics",
  "personal-hygiene",
  "mental-wellbeing",
  "nutrition-health",
  "safety-consent",
  "general",
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "bn", label: "Bengali" },
  { value: "mr", label: "Marathi" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" },
];

type BlockType = ContentBlock["type"];

const BLOCK_LABELS: Record<BlockType, string> = {
  heading: "Heading",
  paragraph: "Paragraph",
  image: "Image",
  video: "Video Embed",
  important_box: "Important Box",
  list: "List",
  callout: "Callout",
};

function BlockEditor({
  block,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: {
  block: ContentBlock;
  index: number;
  total: number;
  onChange: (u: ContentBlock) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="rounded-full bg-berry/10 px-2.5 py-0.5 text-xs font-semibold text-berry">
          {BLOCK_LABELS[block.type]}
        </span>
        <div className="flex items-center gap-1">
          <button type="button" onClick={onMoveUp} disabled={index === 0} className="rounded p-1 text-slate-400 hover:text-ink disabled:opacity-30">
            <ChevronUp className="h-4 w-4" />
          </button>
          <button type="button" onClick={onMoveDown} disabled={index === total - 1} className="rounded p-1 text-slate-400 hover:text-ink disabled:opacity-30">
            <ChevronDown className="h-4 w-4" />
          </button>
          <button type="button" onClick={onRemove} className="rounded p-1 text-red-400 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {(block.type === "heading" || block.type === "paragraph" || block.type === "important_box") && (
        <textarea
          rows={block.type === "paragraph" ? 4 : 2}
          value={block.text || ""}
          onChange={(e) => onChange({ ...block, text: e.target.value })}
          className="w-full rounded-lg border border-peach/60 px-3 py-2 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-berry/30 resize-none"
        />
      )}
      {(block.type === "image" || block.type === "video") && (
        <>
          <div className="mb-2">
            {!block.media_file_id ? (
              <AdminMediaUploader
                type={block.type === "image" ? "image" : "video"}
                onSuccess={(id) => onChange({ ...block, media_file_id: id })}
                label={block.type === "image" ? "Upload Image" : "Upload Video"}
              />
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-moss/30 bg-moss/5 px-4 py-3">
                <span className="text-sm font-medium text-moss">Media Attached ({block.media_file_id.substring(0, 8)}...)</span>
                <button
                  type="button"
                  onClick={() => onChange({ ...block, media_file_id: undefined })}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          <input type="text" value={block.caption || ""} placeholder="Optional caption..." onChange={(e) => onChange({ ...block, caption: e.target.value })} className="w-full rounded-lg border border-peach/60 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-berry/30" />
        </>
      )}
    </div>
  );
}

export default function EditContentPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const { token } = useAuthStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentType, setContentType] = useState<ContentType>("VIDEO");
  const [sourceType, setSourceType] = useState<SourceType>("YOUTUBE");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaFileId, setMediaFileId] = useState("");
  const [thumbnailFileId, setThumbnailFileId] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tagsInput, setTagsInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [isFeatured, setIsFeatured] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  useEffect(() => {
    if (!token || !id) return;
    (async () => {
      try {
        // Use admin get so DRAFT items are accessible
        const res = await learningApi.admin.get(token, id);
        setTitle(res.title);
        setDescription(res.description || "");
        setContentType(res.content_type);
        setSourceType(res.source_type);
        setMediaUrl(res.media_url || "");
        setMediaFileId(res.media_file_id || "");
        setThumbnailFileId(res.thumbnail_file_id || "");
        setCategory(res.category);
        setTagsInput((res.tags || []).join(", "));
        setLanguage(res.language);
        setDurationMinutes(res.duration_minutes);
        setIsFeatured(res.is_featured);
        setBlocks((res.body as ContentBlock[]) || []);
      } catch {
        setErrors(["Failed to load content."]);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, id]);

  function addBlock(type: BlockType) {
    setBlocks((prev) => [...prev, { type }]);
  }
  function updateBlock(i: number, updated: ContentBlock) {
    setBlocks((prev) => prev.map((b, idx) => (idx === i ? updated : b)));
  }
  function removeBlock(i: number) {
    setBlocks((prev) => prev.filter((_, idx) => idx !== i));
  }
  function moveBlock(i: number, dir: -1 | 1) {
    setBlocks((prev) => {
      const next = [...prev];
      const tmp = next[i + dir];
      next[i + dir] = next[i];
      next[i] = tmp;
      return next;
    });
  }

  async function handleSave(publish?: boolean) {
    if (!token) return;
    setErrors([]);
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const payload: Partial<LearningContentCreateInput> = {
      title,
      description: description || undefined,
      content_type: contentType,
      source_type: sourceType,
      media_url: sourceType === "YOUTUBE" ? mediaUrl : undefined,
      media_file_id: sourceType === "PRIVATE_VIDEO" ? mediaFileId : undefined,
      thumbnail_file_id: thumbnailFileId || undefined,
      body: blocks.length > 0 ? blocks : undefined,
      category,
      tags,
      language,
      duration_minutes: durationMinutes,
      is_featured: isFeatured,
    };
    if (publish !== undefined) {
      payload.status = publish ? "PUBLISHED" : "DRAFT";
    }

    setSaving(true);
    try {
      await learningApi.admin.update(token, id, payload);
      router.push("../");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrors([e.message]);
      } else if (typeof e === 'object' && e !== null && 'message' in e) {
        setErrors([String(e.message)]);
      } else {
        setErrors(["Failed to save."]);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="flex h-48 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-berry" /></div>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="../" className="mb-6 inline-flex items-center gap-1.5 text-sm text-berry hover:underline">
        <ArrowLeft className="h-4 w-4" /> Back to Content List
      </Link>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-ink">Edit Content</h2>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setPreviewMode(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${!previewMode ? "bg-white shadow-sm text-berry" : "text-slate-500 hover:text-ink"}`}
          >
            <Edit2 className="h-4 w-4" /> Editor
          </button>
          <button
            onClick={() => setPreviewMode(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition ${previewMode ? "bg-white shadow-sm text-berry" : "text-slate-500 hover:text-ink"}`}
          >
            <Eye className="h-4 w-4" /> Preview
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mb-5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm">
          {errors.map((e, i) => <p key={i} className="text-red-600">{e}</p>)}
        </div>
      )}

      {previewMode ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-2xl mx-auto">
            <header className="mb-8">
              {thumbnailFileId && (
                <div className="mb-6 overflow-hidden rounded-3xl aspect-video w-full bg-slate-100 shadow-sm relative">
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    Image Preview (Media ID: {thumbnailFileId.substring(0, 8)}...)
                  </div>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wider text-berry/80 mb-3">
                <span className="rounded-full bg-berry/10 px-3 py-1">{category}</span>
                {(contentType === "ARTICLE" || contentType === "POST") && (
                  <span className="rounded-full bg-slate-100 px-3 py-1">
                    {calculateReadingTime(blocks)} min read
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
                {title || "Untitled"}
              </h1>
              {description && (
                <p className="mt-3 text-lg text-ink/70 leading-relaxed">{description}</p>
              )}
            </header>

            {contentType === "VIDEO" && (
              <div className="mb-6">
                <LearningVideoPlayer 
                  content={{
                    id: "preview",
                    title,
                    description,
                    content_type: contentType,
                    source_type: sourceType,
                    media_url: mediaUrl,
                    media_file_url: mediaFileId ? "preview" : undefined,
                    thumbnail_url: thumbnailFileId ? "preview" : undefined,
                    body: blocks,
                    category,
                    author_id: "preview-author",
                    tags: [],
                    language,
                    duration_minutes: durationMinutes,
                    is_featured: isFeatured,
                    status: "DRAFT",
                    audience: "ALL",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  }}
                />
              </div>
            )}

            {(contentType === "ARTICLE" || contentType === "POST") && (
              <div className="mb-6">
                <LearningArticleRenderer 
                  content={{
                    id: "preview",
                    title,
                    description,
                    content_type: contentType,
                    source_type: sourceType,
                    media_url: mediaUrl,
                    media_file_id: mediaFileId,
                    thumbnail_file_id: thumbnailFileId,
                    body: blocks,
                    category,
                    author_id: "preview-author",
                    tags: [],
                    language,
                    duration_minutes: durationMinutes,
                    is_featured: isFeatured,
                    status: "DRAFT",
                    audience: "ALL",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                  }}
                />
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-ink">Content Details</h3>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} className="w-full rounded-xl border border-peach/70 px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-berry/30" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Description</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full resize-none rounded-xl border border-peach/70 px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-berry/30" />
          </div>
          {sourceType === "YOUTUBE" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">YouTube URL</label>
              <input type="url" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} className="w-full rounded-xl border border-peach/70 px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-berry/30" />
            </div>
          )}
          {sourceType === "PRIVATE_VIDEO" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <label className="mb-1.5 block text-sm font-semibold text-amber-700">🔒 Private Video Upload</label>
              {!mediaFileId ? (
                <AdminMediaUploader
                  type="video"
                  onSuccess={(id) => setMediaFileId(id)}
                />
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-moss/30 bg-moss/5 px-4 py-3">
                  <span className="text-sm font-medium text-moss">Video Uploaded successfully</span>
                  <button
                    type="button"
                    onClick={() => setMediaFileId("")}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Replace
                  </button>
                </div>
              )}
            </div>
          )}

          {(contentType === "VIDEO" || contentType === "POST") && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                Thumbnail Image
              </label>
              {!thumbnailFileId ? (
                <AdminMediaUploader
                  type="image"
                  label="Upload Thumbnail"
                  onSuccess={(id) => setThumbnailFileId(id)}
                />
              ) : (
                <div className="flex items-center justify-between rounded-xl border border-moss/30 bg-moss/5 px-4 py-3">
                  <span className="text-sm font-medium text-moss">Thumbnail Uploaded</span>
                  <button
                    type="button"
                    onClick={() => setThumbnailFileId("")}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Replace
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {(contentType === "ARTICLE" || contentType === "POST") && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-ink">Content Body</h3>
            <div className="space-y-3">
              {blocks.map((block, i) => (
                <BlockEditor key={i} block={block} index={i} total={blocks.length}
                  onChange={(u) => updateBlock(i, u)} onRemove={() => removeBlock(i)}
                  onMoveUp={() => moveBlock(i, -1)} onMoveDown={() => moveBlock(i, 1)} />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.keys(BLOCK_LABELS) as BlockType[]).map((type) => (
                <button key={type} type="button" onClick={() => addBlock(type)} className="inline-flex items-center gap-1.5 rounded-xl border border-peach/60 bg-peach/10 px-3 py-1.5 text-xs font-medium text-berry hover:bg-berry/10 transition">
                  <Plus className="h-3 w-3" /> {BLOCK_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-ink">Metadata</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-xl border border-peach/70 bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-berry/30">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Language</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full rounded-xl border border-peach/70 bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-berry/30">
                {LANGUAGES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Tags (comma-separated)</label>
            <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className="w-full rounded-xl border border-peach/70 px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-berry/30" />
          </div>
          {contentType === "VIDEO" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink">Duration (minutes)</label>
              <input type="number" min={0} value={durationMinutes} onChange={(e) => setDurationMinutes(Number(e.target.value))} className="w-full rounded-xl border border-peach/70 px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-berry/30" />
            </div>
          )}
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 accent-berry" />
            <span className="text-sm text-ink">Featured content</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pb-8">
          <button type="button" onClick={() => handleSave(false)} disabled={saving || !title} className="flex items-center gap-2 rounded-2xl border border-berry/30 px-6 py-3 text-sm font-semibold text-berry transition hover:bg-berry/5 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save as Draft
          </button>
          <button type="button" onClick={() => handleSave(true)} disabled={saving || !title} className="flex items-center gap-2 rounded-2xl bg-berry px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-berry/90 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Publish
          </button>
          <button type="button" onClick={() => handleSave()} disabled={saving || !title} className="flex items-center gap-2 rounded-2xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save Changes
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
