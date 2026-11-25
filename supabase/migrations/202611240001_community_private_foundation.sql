-- Community foundation. Apply only after the base profiles/auth migration is reviewed.
-- No public user-generated review endpoint is enabled by this migration.
create table if not exists public.user_ratings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  media_type text not null check (media_type in ('movie', 'tv')),
  tmdb_id integer not null check (tmdb_id > 0),
  rating numeric(2,1) not null check (rating between 0.5 and 5 and rating * 2 = trunc(rating * 2)),
  shared_at timestamptz,
  eligible_for_community boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, media_type, tmdb_id)
);
create index if not exists user_ratings_media_shared_idx on public.user_ratings(media_type, tmdb_id) where shared_at is not null and eligible_for_community;

create table if not exists public.user_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  media_type text not null check (media_type in ('movie', 'tv')),
  tmdb_id integer not null check (tmdb_id > 0),
  body text not null check (char_length(trim(body)) between 1 and 5000),
  contains_spoilers boolean not null default false,
  display_name text not null check (char_length(trim(display_name)) between 2 and 32),
  shared_at timestamptz,
  moderation_status text not null default 'pending' check (moderation_status in ('pending', 'approved', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, media_type, tmdb_id)
);
create index if not exists user_reviews_public_idx on public.user_reviews(media_type, tmdb_id, shared_at desc) where shared_at is not null and moderation_status = 'approved';

create table if not exists public.community_rating_stats (
  media_type text not null check (media_type in ('movie', 'tv')),
  tmdb_id integer not null check (tmdb_id > 0),
  rating_count integer not null default 0 check (rating_count >= 0),
  rating_sum numeric(12,1) not null default 0,
  distribution integer[] not null default array[0,0,0,0,0,0,0,0,0,0],
  updated_at timestamptz not null default now(),
  primary key (media_type, tmdb_id)
);

create table if not exists public.review_reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references auth.users(id) on delete cascade,
  review_id uuid not null references public.user_reviews(id) on delete cascade,
  reason text not null check (reason in ('spam', 'spoiler', 'harassment', 'hate', 'other')),
  details text check (char_length(details) <= 1000),
  status text not null default 'open' check (status in ('open', 'reviewed', 'dismissed')),
  created_at timestamptz not null default now(),
  unique (reporter_id, review_id)
);
create table if not exists public.user_blocks (
  blocker_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);
create table if not exists public.moderation_actions (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id),
  review_id uuid references public.user_reviews(id) on delete set null,
  action text not null check (action in ('approve', 'remove', 'restore', 'dismiss_report')),
  reason text not null check (char_length(trim(reason)) between 1 and 1000),
  created_at timestamptz not null default now()
);

alter table public.user_ratings enable row level security;
alter table public.user_reviews enable row level security;
alter table public.community_rating_stats enable row level security;
alter table public.review_reports enable row level security;
alter table public.user_blocks enable row level security;
alter table public.moderation_actions enable row level security;
revoke all on public.community_rating_stats from anon, authenticated;
revoke all on public.moderation_actions from anon, authenticated;

create policy ratings_owner_select on public.user_ratings for select to authenticated using (user_id = (select auth.uid()));
create policy ratings_owner_insert on public.user_ratings for insert to authenticated with check (user_id = (select auth.uid()) and shared_at is null and not eligible_for_community);
create policy ratings_owner_update on public.user_ratings for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and shared_at is null and not eligible_for_community);
create policy ratings_owner_delete on public.user_ratings for delete to authenticated using (user_id = (select auth.uid()));
create policy reviews_owner_select on public.user_reviews for select to authenticated using (user_id = (select auth.uid()));
create policy reviews_owner_insert on public.user_reviews for insert to authenticated with check (user_id = (select auth.uid()) and shared_at is null and moderation_status = 'pending');
create policy reviews_owner_update on public.user_reviews for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and shared_at is null and moderation_status = 'pending');
create policy reviews_owner_delete on public.user_reviews for delete to authenticated using (user_id = (select auth.uid()));
-- No direct table grant: callers receive only approved fields through the view.
create policy reports_owner_select on public.review_reports for select to authenticated using (reporter_id = (select auth.uid()));
create policy reports_owner_insert on public.review_reports for insert to authenticated with check (reporter_id = (select auth.uid()));
create policy blocks_owner_select on public.user_blocks for select to authenticated using (blocker_id = (select auth.uid()));
create policy blocks_owner_insert on public.user_blocks for insert to authenticated with check (blocker_id = (select auth.uid()));
create policy blocks_owner_delete on public.user_blocks for delete to authenticated using (blocker_id = (select auth.uid()));
-- moderation_actions deliberately has no client policy: only the verified server role may write.

-- Recompute exactly one media key after any change, avoiding stale deltas on edits or withdrawal.
create or replace function public.recompute_community_rating_stats(p_media_type text, p_tmdb_id integer)
returns void language plpgsql security definer set search_path = '' as $$
begin
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(p_media_type || ':' || p_tmdb_id::text, 0));
  insert into public.community_rating_stats (media_type, tmdb_id, rating_count, rating_sum, distribution, updated_at)
  select p_media_type, p_tmdb_id, count(*)::integer, coalesce(sum(rating), 0),
    array(select count(r.id)::integer from generate_series(1, 10) as half
      left join public.user_ratings r on r.media_type = p_media_type and r.tmdb_id = p_tmdb_id
        and r.shared_at is not null and r.eligible_for_community and (r.rating * 2)::integer = half), now()
  from public.user_ratings where media_type = p_media_type and tmdb_id = p_tmdb_id and shared_at is not null and eligible_for_community
  on conflict (media_type, tmdb_id) do update set rating_count = excluded.rating_count,
    rating_sum = excluded.rating_sum, distribution = excluded.distribution, updated_at = excluded.updated_at;
end $$;
revoke all on function public.recompute_community_rating_stats(text, integer) from public, anon, authenticated;

create or replace function public.rating_stats_trigger()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if tg_op <> 'INSERT' then perform public.recompute_community_rating_stats(old.media_type, old.tmdb_id); end if;
  if tg_op <> 'DELETE' then perform public.recompute_community_rating_stats(new.media_type, new.tmdb_id); end if;
  return null;
end $$;
revoke all on function public.rating_stats_trigger() from public, anon, authenticated;
create trigger rating_stats_after_change after insert or update or delete on public.user_ratings
for each row execute function public.rating_stats_trigger();

-- Public read model omits user identifiers and gives no direct access to private ratings.
create or replace view public.community_rating_public as
select media_type, tmdb_id, rating_count,
  case when rating_count = 0 then null else round(rating_sum / rating_count, 2) end as average_rating,
  distribution, updated_at from public.community_rating_stats;
grant select on public.community_rating_public to anon, authenticated;
