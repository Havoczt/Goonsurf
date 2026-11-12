"use client";
import { useActionState } from "react";
import { deletePost } from "@/app/actions";
import type { ActionState } from "@/lib/types";

export default function DeletePostButton({ postId }: { postId: string }) {
  const [, formAction, isPending] = useActionState(deletePost, null as ActionState);
  return (
    <form action={formAction} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <input type="hidden" name="post_id" value={postId} />
      <button
        type="submit"
        disabled={isPending}
        className="text-zinc-500 hover:text-accent-hot text-xs px-1.5 py-0.5 rounded hover:bg-zinc-800 transition-colors"
        onClick={(e) => { if (!confirm('Delete this post?')) e.preventDefault() }}
        title="Delete post"
      >
        {isPending ? '...' : '✕'}
      </button>
    </form>
  );
}
