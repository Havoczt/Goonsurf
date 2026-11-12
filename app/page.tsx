import { createClient } from "@/lib/supabase/server";
import { getPosts, type FeedSort } from "@/lib/queries";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export const revalidate = 0;

const SORTS: FeedSort[] = ["hot", "new", "top"];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort = "hot" } = await searchParams;
  const feedSort: FeedSort = SORTS.includes(sort as FeedSort) ? (sort as FeedSort) : "hot";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const posts = await getPosts(feedSort, user?.id).catch(() => []);

  return (
    <div>
      {/* Sort tabs */}
      <div className="flex gap-0 mb-6 border-b border-border">
        {SORTS.map((tab) => (
          <Link
            key={tab}
            href={`/?sort=${tab}`}
            className="relative px-4 py-2 text-xs font-mono transition-colors"
            style={{
              color: feedSort === tab ? "#00e5ff" : "#444",
              borderBottom: feedSort === tab ? "1px solid #00e5ff" : "1px solid transparent",
              marginBottom: "-1px",
              letterSpacing: "0.08em",
            }}
          >
            {tab}
          </Link>
        ))}
      </div>

      {/* Feed */}
      {posts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-muted text-sm font-mono mb-3">// nothing here yet</p>
          {user ? (
            <Link href="/submit" className="text-accent hover:underline text-xs font-mono">
              submit the first link →
            </Link>
          ) : (
            <Link href="/signup" className="text-accent hover:underline text-xs font-mono">
              sign up to post →
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-px">
          {posts.map((post, i) => (
            <PostCard
              key={post.id}
              post={post}
              isLoggedIn={!!user}
              currentUserId={user?.id}
              showDelete
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
