import { playableMediaSchema, type PlayableMedia } from '../../shared/playback'

/** Create a validated BingeAPI player URL with autoplay disabled. */
export function buildBingeApiEmbedUrl(media: PlayableMedia, options: { welcome?: boolean } = {}): string {
  const key = playableMediaSchema.parse(media)
  const path = key.kind === 'movie'
    ? `/embed/movie/${key.tmdbId}`
    : `/embed/tv/${key.tmdbId}/${key.season}/${key.episode}`
  const url = new URL(path, 'https://bingeapi.st')
  url.searchParams.set('autoplay', '0')
  url.searchParams.set('autonext', '0')
  if (key.kind === 'tv') {
    url.searchParams.set('episodes', '0')
    url.searchParams.set('next', '0')
  }
  url.searchParams.set('color', '7DD3FC')
  url.searchParams.set('theme', 'dark')
  url.searchParams.set('resume', '0')
  if (options.welcome) url.searchParams.set('welcome', '1')
  return url.toString()
}
