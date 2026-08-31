"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
  learningApi,
  type LearningContent,
  type LearningContentListResponse,
  type ContentStatus,
} from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import {
  Loader2,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Eye,
  Archive,
  Video,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

const STATUS_COLORS: Record<ContentStatus, string> = {
  DRAFT: "bg-amber-100 text-amber-700",
  UNDER_REVIEW: "bg-blue-100 text-blue-700",
  MEDICALLY_REVIEWED: "bg-purple-100 text-purple-700",
  NEEDS_REVIEW: "bg-red-100 text-red-700",
  PUBLISHED: "bg-green-100 text-green-700",
  ARCHIVED: "bg-slate-100 text-slate-500",
};

const TYPE_ICON: Record<string, React.ReactNode> = {
  VIDEO: <Video className="h-4 w-4" />,
  ARTICLE: <FileText className="h-4 w-4" />,
  POST: <ImageIcon className="h-4 w-4" />,
};

export default function AdminLearningPage() {
  const { token } = useAuthStore();
  const [data, setData] = useState<LearningContentListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);

  const fetchContent = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await learningApi.admin.list(token, {
        search: search || undefined,
        status: statusFilter || undefined,
        content_type: typeFilter || undefined,
        page,
      });
      setData(res);
    } catch {
      setError("Failed to load content. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [token, search, statusFilter, typeFilter, page]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  async function handlePublish(id: string) {
    if (!token) return;
    setActionLoading(id + "_publish");
    try {
      await learningApi.admin.publish(token, id);
      await fetchContent();
    } catch {
      alert("Failed to publish. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleArchive(id: string) {
    if (!token) return;
    setActionLoading(id + "_archive");
    try {
      await learningApi.admin.archive(token, id);
      await fetchContent();
    } catch {
      alert("Failed to archive. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Are you sure you want to permanently delete "${title}"? This cannot be undone.`))
      return;
    if (!token) return;
    setActionLoading(id + "_delete");
    try {
      await learningApi.admin.delete(token, id);
      await fetchContent();
    } catch {
      alert("Failed to delete. Please try again.");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-ink">Learning Content</h2>
          <p className="mt-1 text-sm text-ink/50">
            Manage videos, articles, and posts for the Learn feed.
          </p>
        </div>
        <Link
          href="learning/new"
          className="inline-flex items-center gap-2 rounded-2xl bg-berry px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-berry/90 active:scale-95"
          id="btn-create-content"
        >
          <PlusCircle className="h-4 w-4" />
          Create Content
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            id="admin-search-input"
            placeholder="Search content..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-xl border border-peach/70 bg-white py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-berry/30"
          />
        </div>
        <select
          id="admin-status-filter"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-peach/70 bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-berry/30"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>
        <select
          id="admin-type-filter"
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="rounded-xl border border-peach/70 bg-white px-3 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-berry/30"
        >
          <option value="">All Types</option>
          <option value="VIDEO">Videos</option>
          <option value="ARTICLE">Articles</option>
          <option value="POST">Posts</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Content Table */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-berry" />
        </div>
      ) : !data || data.items.length === 0 ? (
        <div className="flex h-48 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-white text-center">
          <p className="text-sm font-medium text-slate-500">No content found</p>
          <p className="mt-1 text-xs text-slate-400">Create your first piece of content above.</p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-100">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Content
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Created
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.items.map((item: LearningContent) => (
                  <tr key={item.id} className="transition hover:bg-slate-50/70">
                    <td className="px-4 py-4">
                      <p className="max-w-xs truncate text-sm font-semibold text-ink">
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="mt-0.5 max-w-xs truncate text-xs text-ink/50">
                          {item.description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        {TYPE_ICON[item.content_type]}
                        <span>{item.content_type}</span>
                        {item.source_type !== "INTERNAL" && (
                          <span className="text-ink/40">· {item.source_type}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-xs text-ink/60">{item.category}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          STATUS_COLORS[item.status as ContentStatus] || "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-xs text-ink/50">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`learning/${item.id}/edit`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-ink"
                          title="Edit"
                          id={`btn-edit-${item.id}`}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Link>

                        {item.status !== "PUBLISHED" && (
                          <button
                            onClick={() => handlePublish(item.id)}
                            disabled={actionLoading === item.id + "_publish"}
                            className="rounded-lg p-1.5 text-green-500 hover:bg-green-50 hover:text-green-700 disabled:opacity-50"
                            title="Publish"
                            id={`btn-publish-${item.id}`}
                          >
                            {actionLoading === item.id + "_publish" ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        )}

                        {item.status === "PUBLISHED" && (
                          <button
                            onClick={() => handleArchive(item.id)}
                            disabled={actionLoading === item.id + "_archive"}
                            className="rounded-lg p-1.5 text-amber-500 hover:bg-amber-50 hover:text-amber-700 disabled:opacity-50"
                            title="Archive"
                            id={`btn-archive-${item.id}`}
                          >
                            {actionLoading === item.id + "_archive" ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Archive className="h-4 w-4" />
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          disabled={actionLoading === item.id + "_delete"}
                          className="rounded-lg p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          title="Delete"
                          id={`btn-delete-${item.id}`}
                        >
                          {actionLoading === item.id + "_delete" ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.total > data.page_size && (
            <div className="mt-4 flex items-center justify-between text-sm">
              <p className="text-ink/50">
                Showing {(page - 1) * data.page_size + 1}–
                {Math.min(page * data.page_size, data.total)} of {data.total}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-lg border border-peach/60 px-3 py-1.5 text-sm font-medium text-ink disabled:opacity-40 hover:border-berry/30"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * data.page_size >= data.total}
                  className="rounded-lg border border-peach/60 px-3 py-1.5 text-sm font-medium text-ink disabled:opacity-40 hover:border-berry/30"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
