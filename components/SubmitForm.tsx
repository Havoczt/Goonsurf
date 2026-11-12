"use client";

import { useActionState, useState } from "react";
import type { ActionState } from "@/lib/types";
import type { OgData } from "@/lib/og";

interface Props {
  action: (prev: ActionState, data: FormData) => Promise<ActionState>;
}

export default function SubmitForm({ action }: Props) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [url, setUrl] = useState("");
  const [preview, setPreview] = useState<OgData | null>(null);
  const [fetchingOG, setFetchingOG] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function fetchPreview(targetUrl = url) {
    if (!targetUrl) return;
    setFetchingOG(true);
    setPreview(null);
    try {
      const res = await fetch(`/api/og?url=${encodeURIComponent(targetUrl)}`);
      const data: OgData = await res.json();
      setPreview(data);
      setTitle(data.title || "");
      setDescription(data.description || "");
    } finally {
      setFetchingOG(false);
    }
  }

  return (
    <form action={formAction} className="space-y-4">
      {/* URL */}
      <div>
        <label className="text-xs text-zinc-400 mb-1 block">URL</label>
        <div className="flex gap-2">
          <input
            name="url"
            type="url"
            placeholder="https://..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={() => fetchPreview()}
            required
            className="input flex-1"
          />
          <button
            type="button"
            onClick={() => fetchPreview()}
            disabled={fetchingOG || !url}
            className="btn-primary whitespace-nowrap"
          >
            {fetchingOG ? "..." : "preview"}
          </button>
        </div>
      </div>

      {/* OG preview card */}
      {preview && (
        <div className="bg-zinc-900 border border-border rounded-lg p-3 flex gap-3">
          {preview.thumbnail && (
            <div className="flex-shrink-0 relative w-24 h-16 rounded overflow-hidden bg-zinc-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview.thumbnail}
                alt=""
                className="w-full h-full object-cover"
              />
              {preview.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-white text-sm">▶</span>
                </div>
              )}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-medium text-white line-clamp-2">{preview.title}</p>
            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{preview.description}</p>
            <span className="inline-block mt-1 text-[10px] text-zinc-600 uppercase tracking-wide">
              {preview.type}
            </span>
          </div>
        </div>
      )}

      {/* Hidden fields from OG */}
      <input type="hidden" name="thumbnail" value={preview?.thumbnail ?? ""} />
      <input type="hidden" name="type" value={preview?.type ?? "website"} />

      {/* Title */}
      <div>
        <label className="text-xs text-zinc-400 mb-1 block">
          Title <span className="text-zinc-600">(edit if needed)</span>
        </label>
        <input
          name="title"
          placeholder="give it a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength={200}
          className="input"
        />
      </div>

      {/* Optional description */}
      <div>
        <label className="text-xs text-zinc-400 mb-1 block">
          Description <span className="text-zinc-600">(optional)</span>
        </label>
        <textarea
          name="description"
          placeholder="say something about it..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          rows={2}
          className="input resize-none"
        />
      </div>

      {state?.error && (
        <p className="text-red-400 text-xs">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending || !url || !title}
        className="btn-primary w-full"
      >
        {isPending ? "posting..." : "post it"}
      </button>
    </form>
  );
}
