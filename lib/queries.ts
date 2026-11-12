import { createClient } from "@/lib/supabase/server";
import type { Post, Comment } from "@/lib/types";

export type FeedSort = "hot" | "new" | "top";

export async function getPosts(
  sort: FeedSort = "hot",
  userId?: string
): Promise<Post[]> {
  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select("*, profiles(id, username, avatar_url)");

  if (sort === "new") {
    query = query.order("created_at", { ascending: false });
  } else {
    // hot / top — both sort by score; hot also weights recency
    query = query
      .order("score", { ascending: false })
      .order("created_at", { ascending: false });
  }

  query = query.limit(50);

  const { data, error } = await query;
  if (error) throw error;

  if (userId && data?.length) {
    const { data: votes } = await supabase
      .from("votes")
      .select("post_id, value")
      .eq("user_id", userId)
      .in(
        "post_id",
        data.map((p) => p.id)
      );

    const voteMap = new Map(votes?.map((v) => [v.post_id, v.value as 1 | -1]) ?? []);
    return data.map((p) => ({ ...p, user_vote: voteMap.get(p.id) ?? null }));
  }

  return (data ?? []).map((p) => ({ ...p, user_vote: null }));
}

export async function getPost(id: string): Promise<Post | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(username, avatar_url)')
    .eq('id', id)
    .single()
  if (error || !data) return null
  return { ...data, user_vote: null }
}

export async function getComments(postId: string): Promise<Comment[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .select('id, post_id, user_id, body, created_at, profiles(username, avatar_url)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  if (error) return []
  return (data ?? []) as Comment[]
}
