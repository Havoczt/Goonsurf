import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { post_id, value } = await request.json();
  if (!post_id) return Response.json({ error: "Missing post_id" }, { status: 400 });

  // Check existing vote
  const { data: existing } = await supabase
    .from("votes")
    .select("value")
    .eq("user_id", user.id)
    .eq("post_id", post_id)
    .single();

  if (existing) {
    if (existing.value === value) {
      // Same vote — toggle off
      await supabase
        .from("votes")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", post_id);
      return Response.json({ user_vote: null });
    } else {
      // Flip vote
      await supabase
        .from("votes")
        .update({ value })
        .eq("user_id", user.id)
        .eq("post_id", post_id);
      return Response.json({ user_vote: value });
    }
  } else {
    // New vote
    await supabase.from("votes").insert({ user_id: user.id, post_id, value });
    return Response.json({ user_vote: value });
  }
}
