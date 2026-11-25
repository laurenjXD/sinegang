import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'
import { tmdbLocalProxy } from './vite.tmdb-local-proxy'

export default defineConfig({ plugins: [react(), tmdbLocalProxy(), cloudflare()] })
