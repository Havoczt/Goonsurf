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
    <article
      className="feed-item bg-card border border-border flex gap-0 hover:border-[#2a2a2a] group relative transition-[border-color,transform] hover:-translate-y-px"
      style={{
        animationDelay: `${index * 40}ms`,
        borderLeft: "2px solid transparent",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderLeftColor = "#00e5ff";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderLeftColor = "transparent";
      }}
    >
      {/* Vote column */}
      <div className="flex-shrink-0 flex items-center px-3 border-r border-border">
        <VoteButton
          postId={post.id}
          initialScore={post.score}
          initialVote={post.user_vote ?? null}
          isLoggedIn={isLoggedIn}
        />
      </div>

      {/* Thumbnail */}
      {post.thumbnail && (
        <div
          className="flex-shrink-0 self-center mx-3 rounded-sm overflow-hidden bg-[#0d0d0d]"
          style={{ width: "60px", height: "44px", minWidth: "60px" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.thumbnail}
            alt=""
            style={{ width: "60px", height: "44px", objectFit: "cover", display: "block" }}
          />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-accent text-[10px]">▶</span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 py-3 pr-3" style={{ paddingLeft: post.thumbnail ? "0" : "12px" }}>
        <Link
          href={`/post/${post.id}`}
          className="text-sm font-medium text-[#e0e0e0] hover:text-accent transition-colors line-clamp-2 leading-snug block"
          style={{ letterSpacing: "-0.01em" }}
        >
          {post.title}
        </Link>
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted flex-wrap font-mono">
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#555] hover:text-accent transition-colors"
          >
            {getDomain(post.url)}
          </a>
          <span className="text-[#2a2a2a]">·</span>
          <span>{username}</span>
          <span className="text-[#2a2a2a]">·</span>
          <span>{timeAgo(post.created_at)}</span>
          {isVideo && (
            <>
              <span className="text-[#2a2a2a]">·</span>
              <span className="text-accent" style={{ fontSize: "10px" }}>video</span>
            </>
          )}
        </div>
      </div>

      {isOwner && <DeletePostButton postId={post.id} />}
    </article>
  );
}
