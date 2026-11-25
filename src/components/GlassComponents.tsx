import { forwardRef, type ButtonHTMLAttributes, type DetailsHTMLAttributes, type DialogHTMLAttributes, type HTMLAttributes } from 'react'
import { GlassSurface } from './GlassSurface'

type SurfaceProps = HTMLAttributes<HTMLElement> & { level?: '1' | '2' | '3' }

function surface(as: 'nav' | 'div' | 'aside' | 'section' | 'article', name: string) {
  return function MaterialSurface({ level = '2', className = '', ...props }: SurfaceProps) {
    return <GlassSurface as={as} level={level} className={`${name} ${className}`} {...props} />
  }
}

export const GlassNavigation = surface('nav', 'glass-navigation')
export const GlassDrawer = surface('aside', 'glass-drawer')
export const GlassSearch = surface('div', 'glass-search')
export const GlassTabs = surface('div', 'glass-tabs')
export const GlassRatingPanel = surface('section', 'glass-rating-panel')
export const GlassPlayerControls = surface('div', 'glass-player-controls')
export const GlassSheet = surface('section', 'glass-sheet')

export function GlassButton({ className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={`glass-surface glass-2 glass-button ${className}`} {...props} />
}

export const GlassModal = forwardRef<HTMLDialogElement, DialogHTMLAttributes<HTMLDialogElement>>(function GlassModal({ className = '', ...props }, ref) {
  return <dialog ref={ref} className={`glass-surface glass-3 glass-modal ${className}`} {...props} />
})

export function GlassDropdown({ className = '', ...props }: DetailsHTMLAttributes<HTMLDetailsElement>) {
  return <details className={`glass-surface glass-2 glass-dropdown ${className}`} {...props} />
}

export function GlassTooltip({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`glass-surface glass-1 glass-tooltip ${className}`} {...props} />
}
