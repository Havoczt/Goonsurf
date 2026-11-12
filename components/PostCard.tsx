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
}

export default function PostCard({ post, isLoggedIn, currentUserId, showDelete }: Props) {
  const username = post.profiles?.username ?? "anon";
  const isVideo = post.type === "video";
  const isOwner = showDelete && currentUserId === post.user_id;

  return (
    <article className="bg-card border border-border rounded-lg p-3 flex gap-3 hover:border-zinc-600 transition-colors group relative">
      {/* Vote */}
      <div className="flex-shrink-0 flex items-center">
        <VoteButton
          postId={post.id}
          initialScore={post.score}
          initialVote={post.user_vote ?? null}
          isLoggedIn={isLoggedIn}
        />
      </div>

      {/* Thumbnail */}
      {post.thumbnail && (
        <div className="flex-shrink-0 self-center rounded overflow-hidden bg-zinc-800 relative" style={{width:'64px',height:'48px',minWidth:'64px'}}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.thumbnail} alt="" style={{width:'64px',height:'48px',objectFit:'cover',display:'block'}} />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <span className="text-white text-xs">▶</span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/post/${post.id}`}
          className="text-sm font-medium text-white hover:text-accent transition-colors line-clamp-2 leading-snug"
        >
          {post.title}
        </Link>
        <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
          <a href={post.url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-accent">
            {getDomain(post.url)}
          </a>
          <span>·</span>
          <span>{username}</span>
          <span>·</span>
          <span>{timeAgo(post.created_at)}</span>
          {isVideo && <><span>·</span><span className="text-accent-hot text-[10px] font-medium uppercase tracking-wide">video</span></>}
        </div>
        {post.description && (
          <p className="mt-1 text-xs text-zinc-500 line-clamp-1">{post.description}</p>
        )}
      </div>

      {/* Delete button */}
      {isOwner && <DeletePostButton postId={post.id} />}
    </article>
  );
}
