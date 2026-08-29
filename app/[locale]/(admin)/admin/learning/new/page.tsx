"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  onChange: (updated: ContentBlock) => void;
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
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="rounded p-1 text-slate-400 hover:text-ink disabled:opacity-30"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="rounded p-1 text-slate-400 hover:text-ink disabled:opacity-30"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded p-1 text-red-400 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      {(block.type === "heading" || block.type === "paragraph" || block.type === "important_box") && (
        <textarea
          rows={block.type === "paragraph" ? 4 : 2}
          value={block.text || ""}
          placeholder={
            block.type === "heading"
              ? "Heading text..."
              : block.type === "important_box"
              ? "Important notice..."
              : "Paragraph content..."
          }
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
          <input
            type="text"
            value={block.caption || ""}
            placeholder="Optional caption..."
            onChange={(e) => onChange({ ...block, caption: e.target.value })}
            className="w-full rounded-lg border border-peach/60 px-3 py-2 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-berry/30"
          />
        </>
      )}
    </div>
  );
}

export default function NewContentPage() {
  const router = useRouter();
  const { token } = useAuthStore();

  const [contentType, setContentType] = useState<ContentType>("VIDEO");
  const [sourceType, setSourceType] = useState<SourceType>("YOUTUBE");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaFileId, setMediaFileId] = useState("");
  const [thumbnailFileId, setThumbnailFileId] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tagsInput, setTagsInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [durationMinutes, setDurationMinutes] = useState(0);

  const [previewMode, setPreviewMode] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  // When content type changes, reset source type
  function handleContentTypeChange(ct: ContentType) {
    setContentType(ct);
    if (ct === "VIDEO") setSourceType("YOUTUBE");
    else setSourceType("INTERNAL");
    setBlocks([]);
  }

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

  async function handleSave(publish: boolean) {
    setErrors([]);
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: LearningContentCreateInput = {
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
      status: publish ? "PUBLISHED" : "DRAFT",
    };

    if (!token) return;
    setSaving(true);
    try {
      await learningApi.admin.create(token, payload);
      router.push("./");
    } catch (e: unknown) {
      if (e instanceof Error) {
        setErrors([e.message]);
      } else if (typeof e === 'object' && e !== null && 'message' in e) {
        setErrors([String(e.message)]);
      } else {
        setErrors(["Failed to save content."]);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="./"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-berry hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Content List
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-ink">Create New Content</h2>
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
          {errors.map((e, i) => (
            <p key={i} className="text-red-600">
              {e}
            </p>
          ))}
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
        {/* Step 1: Choose content type */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-ink">Content Type</h3>
          <div className="flex gap-3">
            {(["VIDEO", "ARTICLE", "POST"] as ContentType[]).map((ct) => (
              <button
                key={ct}
                type="button"
                id={`btn-type-${ct.toLowerCase()}`}
                onClick={() => handleContentTypeChange(ct)}
                className={`flex-1 rounded-xl border py-3 text-sm font-semibold transition ${
                  contentType === ct
                    ? "border-berry bg-berry/10 text-berry"
                    : "border-slate-200 text-slate-500 hover:border-berry/30"
                }`}
              >
                {ct === "VIDEO" ? "🎥 Video" : ct === "ARTICLE" ? "📄 Article" : "🖼️ Post"}
              </button>
            ))}
          </div>

          {/* Source type for videos */}
          {contentType === "VIDEO" && (
            <div className="mt-4 flex gap-3">
              {(["YOUTUBE", "PRIVATE_VIDEO"] as SourceType[]).map((st) => (
                <label
                  key={st}
                  className={`flex flex-1 cursor-pointer items-center gap-2 rounded-xl border p-3 text-sm transition ${
                    sourceType === st
                      ? "border-berry bg-berry/5 font-semibold text-berry"
                      : "border-slate-200 text-slate-500 hover:border-berry/20"
                  }`}
                >
                  <input
                    type="radio"
                    name="source"
                    value={st}
                    checked={sourceType === st}
                    onChange={() => setSourceType(st)}
                    className="accent-berry"
                    id={`radio-source-${st.toLowerCase()}`}
                  />
                  {st === "YOUTUBE" ? "▶ YouTube" : "🔒 Private Video (R2)"}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Core fields */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-ink">Content Details</h3>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="title-input">
              Title *
            </label>
            <input
              id="title-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Understanding Period Pain"
              maxLength={200}
              className="w-full rounded-xl border border-peach/70 px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-berry/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="description-input">
              Description
            </label>
            <textarea
              id="description-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short summary..."
              className="w-full resize-none rounded-xl border border-peach/70 px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-berry/30"
            />
          </div>

          {/* YouTube URL */}
          {sourceType === "YOUTUBE" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="youtube-url-input">
                YouTube URL *
              </label>
              <input
                id="youtube-url-input"
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-xl border border-peach/70 px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-berry/30"
              />
              <p className="mt-1 text-xs text-ink/50">
                Accepts youtube.com/watch?v= or youtu.be/ formats.
              </p>
            </div>
          )}

          {/* Private Video — R2 media_file_id */}
          {sourceType === "PRIVATE_VIDEO" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-700 mb-2">
                🔒 Private Video Upload
              </p>
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

          {/* Thumbnail */}
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

        {/* Article/Post Body Builder */}
        {(contentType === "ARTICLE" || contentType === "POST") && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold text-ink">Content Body</h3>
            <div className="space-y-3">
              {blocks.map((block, i) => (
                <BlockEditor
                  key={i}
                  block={block}
                  index={i}
                  total={blocks.length}
                  onChange={(updated) => updateBlock(i, updated)}
                  onRemove={() => removeBlock(i)}
                  onMoveUp={() => moveBlock(i, -1)}
                  onMoveDown={() => moveBlock(i, 1)}
                />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(Object.keys(BLOCK_LABELS) as BlockType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  id={`btn-add-block-${type}`}
                  onClick={() => addBlock(type)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-peach/60 bg-peach/10 px-3 py-1.5 text-xs font-medium text-berry hover:bg-berry/10 transition"
                >
                  <Plus className="h-3 w-3" />
                  {BLOCK_LABELS[type]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-ink">Metadata</h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="category-select">
                Category *
              </label>
              <select
                id="category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-peach/70 bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-berry/30"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="language-select">
                Language
              </label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-xl border border-peach/70 bg-white px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-berry/30"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="tags-input">
              Tags (comma-separated)
            </label>
            <input
              id="tags-input"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. periods, puberty, health"
              className="w-full rounded-xl border border-peach/70 px-4 py-3 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-berry/30"
            />
          </div>

          {contentType === "VIDEO" && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink" htmlFor="duration-input">
                Duration (minutes)
              </label>
              <input
                id="duration-input"
                type="number"
                min={0}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full rounded-xl border border-peach/70 px-4 py-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-berry/30"
              />
            </div>
          )}

          <label className="flex cursor-pointer items-center gap-3" id="label-featured">
            <input
              id="is-featured-checkbox"
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 accent-berry"
            />
            <span className="text-sm text-ink">Featured content (shown prominently in feed)</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pb-8">
          <button
            type="button"
            id="btn-save-draft"
            onClick={() => handleSave(false)}
            disabled={saving || !title}
            className="flex items-center gap-2 rounded-2xl border border-berry/30 px-6 py-3 text-sm font-semibold text-berry transition hover:bg-berry/5 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Save Draft
          </button>
          <button
            type="button"
            id="btn-publish"
            onClick={() => handleSave(true)}
            disabled={saving || !title}
            className="flex items-center gap-2 rounded-2xl bg-berry px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-berry/90 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Publish Now
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
