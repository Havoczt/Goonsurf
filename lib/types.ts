export interface Profile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  url: string;
  title: string;
  description: string | null;
  type: "website" | "video";
  thumbnail: string | null;
  score: number;
  created_at: string;
  // from join
  profiles?: { username: string; avatar_url: string | null } | null;
  // injected client-side
  user_vote?: 1 | -1 | null;
}

export type ActionState = { error: string } | null;

export type Comment = {
  id: string
  post_id: string
  user_id: string
  body: string
  created_at: string
  profiles: { username: string | null; avatar_url: string | null } | null
}

export type PostWithAuthor = Post // alias — Post already has profiles
