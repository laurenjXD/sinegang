import type { HTMLAttributes } from 'react'

type GlassLevel = '1' | '2' | '3'
type GlassTag = 'div' | 'section' | 'article' | 'aside' | 'nav'

type GlassSurfaceProps = HTMLAttributes<HTMLElement> & {
  as?: GlassTag
  level?: GlassLevel
}

/** A reusable, theme-aware glass material with a solid CSS fallback. */
export function GlassSurface({ as: Tag = 'div', level = '2', className = '', ...props }: GlassSurfaceProps) {
  const classes = ['glass-surface', `glass-${level}`, className].filter(Boolean).join(' ')
  return <Tag className={classes} {...props} />
}
