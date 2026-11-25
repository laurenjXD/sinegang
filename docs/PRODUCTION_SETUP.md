# Production setup

Supabase is connected and the community foundation migrations are applied to the owner-confirmed project. Cloudflare account read access works, but this workspace's Wrangler CLI is not authenticated. The connected account has no existing Workers or Pages projects; the repository is configured to create a new Worker named `sinegang` on its workers.dev subdomain. Do not send passwords, API tokens, or service-role keys in chat or commit them to the repository. Have the account owner, with a parent or guardian if needed, handle account and secret settings.

## 1. Cloudflare deployment access

The production build and Wrangler dry-run are ready. The actual deploy stopped before upload because the workspace has no `CLOUDFLARE_API_TOKEN`. Store a scoped token in this workspace's secure environment settings (not in chat, source, or `.env.example`) with Workers Scripts Write access for the intended account. The Cloudflare MCP connection currently provides account and Worker read access; Wrangler needs its own deployment credential.

Confirm the account ID and Worker name in `wrangler.jsonc` match the intended production project. The current config selects BingeAPI and sets its welcome option. From the repository, run `pnpm build`, then `pnpm deploy` from an authenticated environment. Deployment publishes the current Worker and frontend, so review the diff and the production settings first.

## 2. TMDB Worker secret

The TMDB Read Access Token exists only in ignored local `.dev.vars`; it was not embedded in the build and has not been uploaded. Add it to the new Worker as a secret named `TMDB_API_TOKEN` using Cloudflare's dashboard or `wrangler secret put TMDB_API_TOKEN` after Wrangler authentication is configured. Enter the value only into Cloudflare's secure prompt/dashboard field. Never use a `VITE_` name for this token. Set `TMDB_DEFAULT_REGION` as a non-secret Worker variable if a default other than `US` is desired.

The checked-in `.env.example` is a names-and-placeholders reference only. For local development, copy it to ignored `.dev.vars`, replace placeholders locally, and keep that file untracked.

## 3. Supabase project and schema

The owner-confirmed Supabase project is connected and the community migrations are applied. The project URL and publishable key are available through the secure Supabase connection but have not been configured on the Cloudflare Worker. Once Worker access is available, set these as Worker variables:

- `VITE_SUPABASE_URL`: the project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: the project's publishable/anon key. This key is designed to be public; access must still be protected by the database's Row-Level Security policies.

Never put a Supabase `service_role` key in frontend variables or the browser. The connected project has the community schema and RLS policies applied. Security advisor checks returned no security lints. Public user reviews remain disabled until moderation, reporting, blocking and age-appropriate visibility are wired and verified.

## 4. Playback and launch checks

The current Worker setting chooses the BingeAPI iframe adapter. This selects a provider URL; it does not guarantee that a title has a playable stream. Before considering playback ready, test a permitted movie and TV episode in the actual Sinegang player on desktop and mobile, verify playback events and the clear unavailable state, and complete the documented privacy, provider, and security review. Do not describe HTTP 200 or a title-matching HTML page as verified playback.

After a deployment, check the production `/api/health`, title/search routes, and player behavior. Record the deployed URL and Worker version in `docs/PROGRESS.md`. No public deployment has occurred: Wrangler stopped because the workspace deployment credential is missing, and the TMDB and Supabase Worker bindings still need configuration.
