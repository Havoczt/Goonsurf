"use client";
import { useActionState } from "react";
import { deleteComment } from "@/app/actions";
import type { Comment, ActionState } from "@/lib/types";
import { timeAgo } from "@/lib/utils";

function DeleteCommentButton({ commentId, postId }: { commentId: string; postId: string }) {
  const [, formAction, isPending] = useActionState(deleteComment, null as ActionState);
  return (
    <form action={formAction}>
      <input type="hidden" name="comment_id" value={commentId} />
      <input type="hidden" name="post_id" value={postId} />
      <button type="submit" disabled={isPending} className="text-zinc-600 hover:text-accent-hot text-xs transition-colors">
        {isPending ? '...' : '✕'}
      </button>
    </form>
  );
}

export default function CommentList({ comments, currentUserId, postId }: {
  comments: Comment[];
  currentUserId?: string;
  postId: string;
}) {
  if (comments.length === 0) {
    return <p className="text-zinc-500 text-sm">no comments yet. be the first!</p>;
  }
  return (
    <ul className="space-y-3">
      {comments.map((c) => (
        <li key={c.id} className="bg-card border border-border rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="font-medium text-white">{c.profiles?.username ?? 'anon'}</span>
              <span>·</span>
              <span>{timeAgo(c.created_at)}</span>
            </div>
            {currentUserId === c.user_id && (
              <DeleteCommentButton commentId={c.id} postId={postId} />
            )}
          </div>
          <p className="text-sm text-zinc-200 whitespace-pre-wrap">{c.body}</p>
        </li>
      ))}
    </ul>
  );
}
