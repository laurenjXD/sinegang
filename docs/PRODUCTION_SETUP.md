# Production setup

This checklist uses the existing Cloudflare Worker and Supabase schema in this repository. Supabase is connected and the community foundation migrations are applied to the owner-confirmed project. Cloudflare identity is connected, but Worker access still needs the `workers-scripts.read` and `workers-scripts.write` scopes. Do not send passwords, API tokens, or service-role keys in chat or commit them to the repository. Since the project owner is under 18, have a parent/guardian or organization owner handle account creation, billing, and secret entry.

## 1. Cloudflare deployment access

Reconnect the Cloudflare MCP connection used by this workspace and allow `workers-scripts.read` to inspect the existing Worker and `workers-scripts.write` to deploy it. If deploying with Wrangler from a terminal instead, create a scoped Cloudflare API token with Worker deploy access and store it as `CLOUDFLARE_API_TOKEN` in that trusted environment. Never put it in `.env.example`, source code, or chat.

Confirm the account ID and Worker name in `wrangler.jsonc` match the intended production project. The current config selects BingeAPI and sets its welcome option. From the repository, run `pnpm build`, then `pnpm deploy` from an authenticated environment. Deployment publishes the current Worker and frontend, so review the diff and the production settings first.

## 2. TMDB Worker secret

Obtain a TMDB Read Access Token from the TMDB account owner. Add it to the existing Worker as a secret named `TMDB_API_TOKEN` using Cloudflare's dashboard secret settings or `wrangler secret put TMDB_API_TOKEN`. Enter the value only into the secure prompt/dashboard field. Never use a `VITE_` name for this token. Set `TMDB_DEFAULT_REGION` as a non-secret Worker variable if a default other than `US` is desired.

The checked-in `.env.example` is a names-and-placeholders reference only. For local development, copy it to ignored `.dev.vars`, replace placeholders locally, and keep that file untracked.

## 3. Supabase project and schema

The owner-confirmed Supabase project is connected and the community migrations are applied. The project URL and publishable key are available through the secure Supabase connection but have not been configured on the Cloudflare Worker. Once Worker access is available, set these as Worker variables:

- `VITE_SUPABASE_URL`: the project URL.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: the project's publishable/anon key. This key is designed to be public; access must still be protected by the database's Row-Level Security policies.

Never put a Supabase `service_role` key in frontend variables or the browser. The connected project has the community schema and RLS policies applied. Security advisor checks returned no security lints. Public user reviews remain disabled until moderation, reporting, blocking and age-appropriate visibility are wired and verified.

## 4. Playback and launch checks

The current Worker setting chooses the BingeAPI iframe adapter. This selects a provider URL; it does not guarantee that a title has a playable stream. Before considering playback ready, test a permitted movie and TV episode in the actual Sinegang player on desktop and mobile, verify playback events and the clear unavailable state, and complete the documented privacy, provider, and security review. Do not describe HTTP 200 or a title-matching HTML page as verified playback.

After a deployment, check the production `/api/health`, title/search routes, and player behavior. Record the deployed URL and Worker version in `docs/PROGRESS.md`. The current Cloudflare connection cannot yet inspect or deploy the Worker because its Worker script scopes are missing; no public deployment has occurred.
