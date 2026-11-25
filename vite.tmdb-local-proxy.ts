import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'
import worker from './worker/index'

/**
 * Local-only bridge: workerd cannot use this environment's outbound HTTP proxy,
 * but the Node Vite process can. Run the same Hono app in Node for TMDB routes
 * during `vite dev`; production requests still run in the Cloudflare Worker.
 */
function readLocalBindings(): Record<string, string> {
  try {
    return Object.fromEntries(readFileSync(resolve('.dev.vars'), 'utf8')
      .split(/\r?\n/)
      .filter((line) => line.trim() && !line.trim().startsWith('#'))
      .map((line) => {
        const separator = line.indexOf('=')
        return separator < 0 ? [line.trim(), ''] : [line.slice(0, separator).trim(), line.slice(separator + 1).trim()]
      }))
  } catch {
    return {}
  }
}

export function tmdbLocalProxy(): Plugin {
  return {
    name: 'sinegang-tmdb-local-proxy',
    enforce: 'pre',
    configureServer(server) {
      const bindings = readLocalBindings()
      server.middlewares.use(async (req, res, next) => {
        const pathname = (req.url ?? '/').split('?', 1)[0]
        const isTmdbRoute = pathname.startsWith('/api/discover/') || pathname.startsWith('/api/title/') || pathname === '/api/search'
        if (req.method !== 'GET' || !isTmdbRoute) return next()

        try {
          const request = new Request(new URL(req.url ?? '/', `http://${req.headers.host ?? 'localhost'}`), {
            method: 'GET',
            headers: req.headers as HeadersInit,
          })
          const response = await worker.fetch(request, bindings)
          res.statusCode = response.status
          response.headers.forEach((value, name) => res.setHeader(name, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch {
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ error: { code: 'CATALOG_UPSTREAM_ERROR', message: 'Catalog data is temporarily unavailable.' } }))
        }
      })
    },
  }
}
