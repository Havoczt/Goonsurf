"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { submitSchema } from "@/lib/validations";
import type { ActionState } from "@/lib/types";

// ── Auth ────────────────────────────────────────────────────

export async function login(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });
  if (error) return { error: error.message };
  redirect("/");
}

export async function signup(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const username = (formData.get("username") as string).trim().toLowerCase();

  if (!/^[a-z0-9_]{2,30}$/.test(username)) {
    return { error: "Username: 2-30 chars, letters/numbers/underscore only." };
  }

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: { data: { username } },
  });
  if (error) return { error: error.message };
  redirect("/");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

// ── Posts ───────────────────────────────────────────────────

export async function createPost(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const raw = {
    url: (formData.get("url") as string).trim(),
    title: (formData.get("title") as string).trim(),
    description: (formData.get("description") as string).trim() || undefined,
    type: (formData.get("type") as string) || "website",
  };

  const parsed = submitSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const thumbnail = (formData.get("thumbnail") as string) || null;

  const { error } = await supabase.from("posts").insert({
    user_id: user.id,
    url: parsed.data.url,
    title: parsed.data.title,
    description: parsed.data.description || null,
    type: parsed.data.type,
    thumbnail,
  });

  if (error) return { error: error.message };
  redirect("/");
}

export async function createComment(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not logged in' }

  const postId = formData.get('post_id') as string
  const body = (formData.get('body') as string).trim()
  if (!body || body.length > 2000) return { error: 'Comment must be 1–2000 characters' }

  const { error } = await supabase.from('comments').insert({ post_id: postId, user_id: user.id, body })
  if (error) return { error: error.message }
  revalidatePath(`/post/${postId}`)
  return null
}

export async function deletePost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const postId = formData.get('post_id') as string
  const { error } = await supabase.from('posts').delete().eq('id', postId).eq('user_id', user.id)
  if (error) return { error: error.message }
  revalidatePath('/')
  redirect('/')
}

export async function deleteComment(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const commentId = formData.get('comment_id') as string
  const postId = formData.get('post_id') as string
  const { error } = await supabase.from('comments').delete().eq('id', commentId).eq('user_id', user.id)
  if (error) return { error: error.message }
  revalidatePath(`/post/${postId}`)
  return null
}
