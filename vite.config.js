import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'

function imgeaAssets() {
  return {
    name: 'imgea-assets',
    configureServer(server) {
      server.middlewares.use('/mysite/Imgea', (req, res, next) => {
        const filePath = path.resolve('Imgea', decodeURIComponent(req.url.replace(/^\/+/, '')))
        if (!filePath.startsWith(path.resolve('Imgea')) || !fs.existsSync(filePath)) {
          next()
          return
        }
        fs.createReadStream(filePath).pipe(res)
      })
    },
    closeBundle() {
      const source = path.resolve('Imgea')
      const target = path.resolve('dist', 'Imgea')
      if (fs.existsSync(source)) {
        fs.cpSync(source, target, { recursive: true })
      }
    },
  }
}

export default defineConfig({
  base: '/mysite/',
  plugins: [react(), tailwindcss(), imgeaAssets()],
})
