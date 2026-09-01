"use client";

import { useEffect, useState, useCallback } from "react";
import { learningApi } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { useRouter } from "next/navigation";
import { Loader2, Search, ExternalLink, Hash, Clock, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function AdminResearchPage() {
  const { token } = useAuthStore();
  const [sources, setSources] = useState<{ id: string; title?: string; domain?: string; canonical_url?: string; content_hash?: string; created_at?: string; url?: string; raw_content?: string; source_type?: string; accessed_at?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingesting, setIngesting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [selectedSource, setSelectedSource] = useState<{ id: string; title?: string; domain?: string; canonical_url?: string; content_hash?: string; created_at?: string; url?: string; raw_content?: string; source_type?: string; accessed_at?: string } | null>(null);
  const router = useRouter();

  const fetchSources = useCallback(() => {
    if (!token) return;
    setLoading(true);
    learningApi.admin.listResearch(token)
      .then(setSources)
      .catch((err) => toast.error("Failed to load research sources: " + err.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !urlInput.trim()) return;

    setIngesting(true);
    try {
      await learningApi.admin.ingestResearch(token, urlInput);
      toast.success("Source successfully ingested and researched!");
      setUrlInput("");
      fetchSources();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to ingest source.");
    } finally {
      setIngesting(false);
    }
  };

  const handleGenerateDraft = async () => {
    if (!token || !selectedSource) return;
    setGenerating(true);
    try {
      const res = await learningApi.admin.generateFromResearch(token, selectedSource.id);
      toast.success("Draft generated successfully!");
      // Navigate to the editor for the new content
      router.push(`/admin/learning/${res.content_id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to generate draft.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
            Internet Research & Ingestion
          </h1>
          <p className="mt-2 text-ink/60">
            Fetch authoritative health sources, extract facts, and store them securely for AI generation.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">New Research Task</h2>
        <form onSubmit={handleIngest} className="flex gap-4">
          <input
            type="url"
            required
            placeholder="https://www.who.int/news-room/fact-sheets/..."
            className="flex-1 rounded-xl border border-slate-300 px-4 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            disabled={ingesting}
          />
          <button
            type="submit"
            disabled={ingesting || !urlInput.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2 font-medium text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {ingesting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
            Research
          </button>
        </form>
        <p className="mt-2 text-xs text-slate-500">
          Only authorized sources (WHO, CDC, MoHFW, etc.) should be ingested. Automated protections will block internal IPs and oversized pages.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-1 lg:col-span-1 flex flex-col gap-4">
          <h2 className="text-lg font-bold">Recent Research</h2>
          {loading && sources.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : sources.length === 0 ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm text-slate-500">
              No research sources found.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sources.map((source) => (
                <button
                  key={source.id}
                  onClick={() => setSelectedSource(source)}
                  className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors ${
                    selectedSource?.id === source.id
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-slate-200 bg-white hover:border-primary/50"
                  }`}
                >
                  <span className="line-clamp-1 font-semibold text-ink">{source.title || source.domain}</span>
                  <span className="text-xs text-slate-500">{source.domain}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-1 md:col-span-1 lg:col-span-2">
          {selectedSource ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-ink">{selectedSource.title || "Untitled Source"}</h2>
                  <a
                    href={selectedSource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    {selectedSource.url} <ExternalLink size={14} />
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {selectedSource.source_type}
                  </span>
                  <button
                    onClick={handleGenerateDraft}
                    disabled={generating}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    Generate Draft (EN)
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm">
                  <Hash className="h-4 w-4 text-slate-400" />
                  <span className="font-medium text-slate-700">Hash:</span>
                  <span className="truncate text-slate-500">{selectedSource.content_hash?.substring(0, 16)}...</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-50 p-3 text-sm">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="font-medium text-slate-700">Accessed:</span>
                  <span className="text-slate-500">
                    {selectedSource.accessed_at ? new Date(selectedSource.accessed_at).toLocaleDateString() : "Unknown"}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink">
                  <FileText className="h-4 w-4" /> Extracted Raw Content (Preview)
                </div>
                <div className="h-64 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  {selectedSource.raw_content ? (
                    <div className="whitespace-pre-wrap">{selectedSource.raw_content}</div>
                  ) : (
                    <span className="italic text-slate-400">No content extracted.</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full min-h-[400px] items-center justify-center rounded-2xl border border-slate-200 border-dashed bg-slate-50">
              <div className="text-center text-slate-500">
                <Search className="mx-auto mb-2 h-8 w-8 opacity-20" />
                <p>Select a research source to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
