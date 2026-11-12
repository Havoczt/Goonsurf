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
  const feedSort: FeedSort = SORTS.includes(sort as FeedSort)
    ? (sort as FeedSort)
    : "hot";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const posts = await getPosts(feedSort, user?.id).catch(() => []);

  return (
    <div>
      {/* Sort tabs */}
      <div className="flex gap-1 mb-4">
        {SORTS.map((tab) => (
          <Link
            key={tab}
            href={`/?sort=${tab}`}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              feedSort === tab
                ? "bg-accent text-white"
                : "text-zinc-500 hover:text-white"
            }`}
          >
            {tab}
          </Link>
        ))}
      </div>

      {/* Feed */}
      {posts.length === 0 ? (
        <div className="text-center text-zinc-500 py-20">
          <p className="text-lg mb-2">nothing here yet</p>
          {user ? (
            <Link href="/submit" className="text-accent hover:underline text-sm">
              be the first to post →
            </Link>
          ) : (
            <Link href="/signup" className="text-accent hover:underline text-sm">
              sign up to post →
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} isLoggedIn={!!user} currentUserId={user?.id} showDelete />
          ))}
        </div>
      )}
    </div>
  );
}
