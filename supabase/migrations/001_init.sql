-- ============================================================
-- GoonSurf DB Schema
-- ============================================================

-- Profiles (1:1 with auth.users)
create table public.profiles (
  id          uuid references auth.users on delete cascade primary key,
  username    text unique not null,
  avatar_url  text,
  created_at  timestamptz default now()
);

-- Posts
create table public.posts (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid references public.profiles(id) on delete cascade not null,
  url           text not null,
  title         text not null,
  description   text,
  type          text check (type in ('website', 'video')) not null default 'website',
  thumbnail     text,
  score         integer not null default 0,
  created_at    timestamptz default now()
);

-- Votes (+1 or -1, one per user per post)
create table public.votes (
  id       uuid default gen_random_uuid() primary key,
  user_id  uuid references public.profiles(id) on delete cascade not null,
  post_id  uuid references public.posts(id) on delete cascade not null,
  value    integer check (value in (1, -1)) not null,
  unique(user_id, post_id)
);

-- ============================================================
-- Functions
-- ============================================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Recalc score when a vote is inserted/updated/deleted
create or replace function public.update_post_score()
returns trigger language plpgsql as $$
begin
  update public.posts
  set score = (select coalesce(sum(value), 0) from public.votes where post_id = coalesce(new.post_id, old.post_id))
  where id = coalesce(new.post_id, old.post_id);
  return coalesce(new, old);
end;
$$;

create trigger on_vote_change
  after insert or update or delete on public.votes
  for each row execute procedure public.update_post_score();

-- ============================================================
-- RLS
-- ============================================================
alter table public.profiles enable row level security;
alter table public.posts    enable row level security;
alter table public.votes    enable row level security;

-- profiles
create policy "profiles_read"   on public.profiles for select using (true);
create policy "profiles_insert" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update" on public.profiles for update using (auth.uid() = id);

-- posts
create policy "posts_read"   on public.posts for select using (true);
create policy "posts_insert" on public.posts for insert with check (auth.uid() = user_id);
create policy "posts_delete" on public.posts for delete using (auth.uid() = user_id);

-- votes
create policy "votes_read"   on public.votes for select using (true);
create policy "votes_insert" on public.votes for insert with check (auth.uid() = user_id);
create policy "votes_update" on public.votes for update using (auth.uid() = user_id);
create policy "votes_delete" on public.votes for delete using (auth.uid() = user_id);

-- ============================================================
-- Indexes
-- ============================================================
create index posts_score_idx      on public.posts(score desc);
create index posts_created_at_idx on public.posts(created_at desc);
create index votes_post_id_idx    on public.votes(post_id);
