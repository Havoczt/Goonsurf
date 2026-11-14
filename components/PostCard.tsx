import type { Post } from "@/lib/types";
import { getDomain, timeAgo } from "@/lib/utils";
import Link from "next/link";
import VoteButton from "./VoteButton";
import DeletePostButton from "./DeletePostButton";

interface Props {
  post: Post;
  isLoggedIn: boolean;
  currentUserId?: string;
  showDelete?: boolean;
  index?: number;
}

export default function PostCard({ post, isLoggedIn, currentUserId, showDelete, index = 0 }: Props) {
  const username = post.profiles?.username ?? "anon";
  const isVideo = post.type === "video";
  const isOwner = showDelete && currentUserId === post.user_id;

  return (
    <article className="gs-card gs-anim" style={{ animationDelay: `${index * 40}ms` }}>

      {/* Vote column */}
      <div style={{ display: "flex", alignItems: "center", padding: "0 12px", borderRight: "1px solid #27272a", flexShrink: 0 }}>
        <VoteButton postId={post.id} initialScore={post.score} initialVote={post.user_vote ?? null} isLoggedIn={isLoggedIn} />
      </div>

      {/* Thumbnail */}
      {post.thumbnail && (
        <div style={{ width: 72, minWidth: 72, alignSelf: "center", margin: "0 12px", borderRadius: 6, overflow: "hidden", background: "#18181b", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.thumbnail} alt="" style={{ width: 72, height: 52, objectFit: "cover", display: "block" }} />
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, padding: "12px 12px 12px 0", paddingLeft: post.thumbnail ? 0 : 12 }}>
        <Link href={`/post/${post.id}`} style={{ display: "block", fontSize: 14, fontWeight: 500, color: "#e4e4e7", lineHeight: 1.4, textDecoration: "none" }}
          className="hover:text-cyan-400 transition-colors line-clamp-2">
          {post.title}
        </Link>
        <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#52525b", flexWrap: "wrap", fontFamily: "var(--font-mono-loaded, monospace)" }}>
          <a href={post.url} target="_blank" rel="noopener noreferrer" style={{ color: "#52525b", textDecoration: "none" }} className="hover:text-cyan-400 transition-colors">
            {getDomain(post.url)}
          </a>
          <span style={{ color: "#3f3f46" }}>·</span>
          <span>{username}</span>
          <span style={{ color: "#3f3f46" }}>·</span>
          <span>{timeAgo(post.created_at)}</span>
          {isVideo && <><span style={{ color: "#3f3f46" }}>·</span><span style={{ color: "#00e5ff", fontSize: 10, fontWeight: 600 }}>VIDEO</span></>}
        </div>
      </div>

      {isOwner && <DeletePostButton postId={post.id} />}
    </article>
  );
}
