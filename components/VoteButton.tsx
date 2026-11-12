"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  postId: string;
  initialScore: number;
  initialVote: 1 | -1 | null;
  isLoggedIn: boolean;
}

export default function VoteButton({
  postId,
  initialScore,
  initialVote,
  isLoggedIn,
}: Props) {
  const [score, setScore] = useState(initialScore);
  const [vote, setVote] = useState<1 | -1 | null>(initialVote);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function cast(value: 1 | -1) {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    if (loading) return;

    // Optimistic
    const prev = vote;
    const prevScore = score;
    if (vote === value) {
      setVote(null);
      setScore(score - value);
    } else {
      setScore(score + value - (vote ?? 0));
      setVote(value);
    }
    setLoading(true);

    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post_id: postId, value }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setVote(data.user_vote);
    } catch {
      setVote(prev);
      setScore(prevScore);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-0.5">
      <button
        onClick={() => cast(1)}
        disabled={loading}
        className={cn(
          "text-xs transition-colors px-1",
          vote === 1 ? "text-accent-hot" : "text-zinc-500 hover:text-white"
        )}
        aria-label="upvote"
      >
        ▲
      </button>
      <span className="text-xs font-mono text-zinc-400 leading-none">{score}</span>
      <button
        onClick={() => cast(-1)}
        disabled={loading}
        className={cn(
          "text-xs transition-colors px-1",
          vote === -1 ? "text-blue-400" : "text-zinc-600 hover:text-zinc-400"
        )}
        aria-label="downvote"
      >
        ▼
      </button>
    </div>
  );
}
