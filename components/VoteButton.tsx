"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  postId: string;
  initialScore: number;
  initialVote: 1 | -1 | null;
  isLoggedIn: boolean;
}

export default function VoteButton({ postId, initialScore, initialVote, isLoggedIn }: Props) {
  const [score, setScore] = useState(initialScore);
  const [vote, setVote] = useState<1 | -1 | null>(initialVote);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function cast(value: 1 | -1) {
    if (!isLoggedIn) { router.push("/login"); return; }
    if (loading) return;
    const prev = vote;
    const prevScore = score;
    if (vote === value) { setVote(null); setScore(score - value); }
    else { setScore(score + value - (vote ?? 0)); setVote(value); }
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
      setVote(prev); setScore(prevScore);
    } finally { setLoading(false); }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => cast(1)}
        disabled={loading}
        aria-label="upvote"
        style={{ fontSize: 11, color: vote === 1 ? "#00e5ff" : "#3f3f3f", transition: "color 0.1s", lineHeight: 1 }}
        className="hover:!text-[#00e5ff]"
      >▲</button>
      <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: vote ? "#00e5ff" : "#555", lineHeight: 1 }}>
        {score}
      </span>
      <button
        onClick={() => cast(-1)}
        disabled={loading}
        aria-label="downvote"
        style={{ fontSize: 11, color: vote === -1 ? "#ff4444" : "#3f3f3f", transition: "color 0.1s", lineHeight: 1 }}
        className="hover:!text-zinc-400"
      >▼</button>
    </div>
  );
}
