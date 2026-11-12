"use client";
import { useActionState, useRef } from "react";
import { createComment } from "@/app/actions";
import type { ActionState } from "@/lib/types";

export default function CommentForm({ postId }: { postId: string }) {
  const [state, formAction, isPending] = useActionState(createComment, null as ActionState);
  const ref = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={ref}
      action={async (fd: FormData) => {
        await formAction(fd);
        ref.current?.reset();
      }}
      className="space-y-2 mt-4"
    >
      <input type="hidden" name="post_id" value={postId} />
      <textarea
        name="body"
        rows={3}
        required
        maxLength={2000}
        placeholder="add a comment..."
        disabled={isPending}
        className="input resize-none w-full"
      />
      {state?.error && <p className="text-red-400 text-xs">{state.error}</p>}
      <div className="flex justify-end">
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? '...' : 'comment'}
        </button>
      </div>
    </form>
  );
}
