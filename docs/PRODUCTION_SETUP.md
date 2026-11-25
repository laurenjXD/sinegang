# Production setup

This checklist uses the existing Cloudflare Worker and Supabase schema in this repository. The Worker can be prepared locally, but production setup is blocked until an account owner connects the existing Cloudflare and Supabase projects. Do not send passwords, API tokens, or service-role keys in chat or commit them to the repository. Since the project owner is under 18, have a parent/guardian or organization owner handle account creation, billing, and secret entry.

## 1. Cloudflare deployment access

In the Cloudflare account that owns the existing Sinegang Worker, create a scoped API token with permission to deploy Workers and access the account's Worker resources. Add it to the trusted deployment environment as `CLOUDFLARE_API_TOKEN` (for local work, use the machine's secret store). Do not put it in `.env.example`, source code, or chat.

Confirm the account ID and Worker name in `wrangler.jsonc` match the intended production project. The current config selects BingeAPI and sets its welcome option. From the repository, run `pnpm build`, then `pnpm deploy` from an authenticated environment. Deployment publishes the current Worker and frontend, so review the diff and the production settings first.

## 2. TMDB Worker secret

Obtain a TMDB Read Access Token from the TMDB account owner. Add it to the existing Worker as a secret named `TMDB_API_TOKEN` using Cloudflare's dashboard secret settings or `wrangler secret put TMDB_API_TOKEN`. Enter the value only into the secure prompt/dashboard field. Never use a `VITE_` name for this token. Set `TMDB_DEFAULT_REGION` as a non-secret Worker variable if a default other than `US` is desired.

The checked-in `.env.example` is a names-and-placeholders reference only. For local development, copy it to ignored `.dev.vars`, replace placeholders locally, and keep that file untracked.

## 3. Supabase project and schema

Use the existing Sinegang Supabase project if one has already been created. If there is no project, an account owner must create one and choose its region; avoid enabling paid features without explicit budget approval. Configure the Worker with:

- `VITE_SUPABASE_URL`: the project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: the project's publishable/anon key. This key is designed to be public; access must still be protected by the database's Row-Level Security policies.

Never put a Supabase `service_role` key in frontend variables or the browser. Apply the checked-in migration only after confirming the target project and reviewing its SQL: `supabase link --project-ref <project-ref>` followed by `supabase db push`. The Supabase CLI may request a database password; enter it only in its secure prompt. Verify the migration and RLS policies in the project dashboard. No migration has been applied to a live project from this workspace.

## 4. Playback and launch checks

The current Worker setting chooses the BingeAPI iframe adapter. This selects a provider URL; it does not guarantee that a title has a playable stream. Before considering playback ready, test a permitted movie and TV episode in the actual Sinegang player on desktop and mobile, verify playback events and the clear unavailable state, and complete the documented privacy, provider, and security review. Do not describe HTTP 200 or a title-matching HTML page as verified playback.

After a deployment, check the production `/api/health`, title/search routes, and player behavior. Record the deployed URL and Worker version in `docs/PROGRESS.md`. The current workspace has no Cloudflare deploy credential, Supabase project URL/key, or existing production hostname available to it, so deployment and live database setup cannot be completed until the account owner connects those resources securely.
