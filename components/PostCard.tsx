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
      className="feed-item group relative flex gap-0 bg-zinc-900/50 border border-zinc-800/60 rounded-sm"
      style={{ animationDelay: `${index * 45}ms` }}
    >
      {/* Vote */}
      <div className="flex-shrink-0 flex items-center px-3 border-r border-zinc-800/60">
        <VoteButton
          postId={post.id}
          initialScore={post.score}
          initialVote={post.user_vote ?? null}
          isLoggedIn={isLoggedIn}
        />
      </div>

      {/* Thumbnail */}
      {post.thumbnail && (
        <div className="flex-shrink-0 self-center ml-3 rounded-sm overflow-hidden bg-zinc-800" style={{ width: 60, height: 44, minWidth: 60 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.thumbnail} alt="" style={{ width: 60, height: 44, objectFit: "cover", display: "block" }} />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0 py-3 px-3">
        <Link
          href={`/post/${post.id}`}
          className="text-sm font-medium text-zinc-100 hover:text-[#00e5ff] transition-colors line-clamp-2 leading-snug block"
        >
          {post.title}
        </Link>
        <div className="mt-1.5 flex items-center gap-2 text-zinc-500 flex-wrap" style={{ fontSize: 11, fontFamily: "var(--font-mono)" }}>
          <a href={post.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#00e5ff] transition-colors">
            {getDomain(post.url)}
          </a>
          <span className="text-zinc-700">·</span>
          <span>{username}</span>
          <span className="text-zinc-700">·</span>
          <span>{timeAgo(post.created_at)}</span>
          {isVideo && (
            <>
              <span className="text-zinc-700">·</span>
              <span style={{ color: "#00e5ff", fontSize: 10 }}>video</span>
            </>
          )}
        </div>
      </div>

      {isOwner && <DeletePostButton postId={post.id} />}
    </article>
  );
}
