import { notFound } from "next/navigation";
import Link from "next/link";
import { getPost, getComments } from "@/lib/queries";
import { createClient } from "@/lib/supabase/server";
import PostCard from "@/components/PostCard";
import CommentList from "@/components/CommentList";
import CommentForm from "@/components/CommentForm";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, comments] = await Promise.all([getPost(id), getComments(id)]);
  if (!post) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let userVote: 1 | -1 | null = null;
  if (user) {
    const { data } = await supabase.from("votes").select("value").eq("user_id", user.id).eq("post_id", id).single();
    userVote = (data?.value as 1 | -1) ?? null;
  }

  const postWithVote = { ...post, user_vote: userVote };

  return (
    <div>
      <Link href="/" className="text-xs text-zinc-500 hover:text-white mb-4 inline-block">← back</Link>
      <PostCard post={postWithVote} isLoggedIn={!!user} currentUserId={user?.id} showDelete />

      <section className="mt-6">
        <h2 className="text-sm font-medium text-zinc-400 mb-3">
          {comments.length} comment{comments.length !== 1 ? 's' : ''}
        </h2>
        <CommentList comments={comments} currentUserId={user?.id} postId={id} />
        {user ? (
          <CommentForm postId={id} />
        ) : (
          <p className="text-sm text-zinc-500 mt-4">
            <Link href="/login" className="text-accent hover:underline">log in</Link> to comment
          </p>
        )}
      </section>
    </div>
  );
}
