-- Expose only non-empty aggregates and make the read model obey its source table's RLS.
-- Zero-count cache rows may exist after a private rating or withdrawal; never expose them.
revoke all on public.community_rating_stats from public, anon, authenticated;

create policy community_rating_stats_public_select
  on public.community_rating_stats
  for select to anon, authenticated
  using (rating_count > 0);

grant select on public.community_rating_stats to anon, authenticated;

create or replace view public.community_rating_public
  with (security_invoker = true)
as
select media_type, tmdb_id, rating_count,
  round(rating_sum / rating_count, 2) as average_rating,
  distribution, updated_at
from public.community_rating_stats
where rating_count > 0;

revoke all on public.community_rating_public from public, anon, authenticated;
grant select on public.community_rating_public to anon, authenticated;

-- Make the intentionally server-only audit table's client denial explicit.
create policy moderation_actions_client_lockdown
  on public.moderation_actions
  as restrictive
  for all to anon, authenticated
  using (false)
  with check (false);

-- Cover foreign-key lookup paths identified by the database performance advisor.
create index if not exists review_reports_review_id_idx on public.review_reports(review_id);
create index if not exists moderation_actions_actor_id_idx on public.moderation_actions(actor_id);
create index if not exists moderation_actions_review_id_idx on public.moderation_actions(review_id) where review_id is not null;
create index if not exists user_blocks_blocked_id_idx on public.user_blocks(blocked_id);
