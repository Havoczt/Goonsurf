import { createClient } from "@/lib/supabase/server";
import { getPosts, type FeedSort } from "@/lib/queries";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export const revalidate = 0;

const SORTS: FeedSort[] = ["hot", "new", "top"];

export default async function HomePage({ searchParams }: { searchParams: Promise<{ sort?: string }> }) {
  const { sort = "hot" } = await searchParams;
  const feedSort: FeedSort = SORTS.includes(sort as FeedSort) ? (sort as FeedSort) : "hot";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const posts = await getPosts(feedSort, user?.id).catch(() => []);

  return (
    <div>
      {/* Sort tabs */}
      <div className="flex gap-0 mb-5 border-b border-zinc-800">
        {SORTS.map((tab) => (
          <Link
            key={tab}
            href={`/?sort=${tab}`}
            className="px-4 py-2 text-xs transition-colors"
            style={{
              fontFamily: "var(--font-mono)",
              color: feedSort === tab ? "#00e5ff" : "#555",
              borderBottom: feedSort === tab ? "1px solid #00e5ff" : "1px solid transparent",
              marginBottom: -1,
              letterSpacing: "0.06em",
            }}
          >
            {tab}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-zinc-600 text-sm mb-3" style={{ fontFamily: "var(--font-mono)" }}>// nothing here yet</p>
          <Link href={user ? "/submit" : "/signup"} className="text-xs hover:underline" style={{ color: "#00e5ff", fontFamily: "var(--font-mono)" }}>
            {user ? "submit the first link →" : "sign up to post →"}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} isLoggedIn={!!user} currentUserId={user?.id} showDelete index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
