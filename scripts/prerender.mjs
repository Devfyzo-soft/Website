// Runs after `vite build`: renders <App /> to HTML on the server and writes it into dist/index.html, so the first paint
// is the real home page (and search / AI crawlers get the full text), instead of a loader. main.jsx then hydrates it.
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')

const server = await createServer({ root, appType: 'custom', server: { middlewareMode: true }, logLevel: 'error' })
try {
  const { default: App } = await server.ssrLoadModule('/src/App.jsx')
  let appHtml = renderToString(createElement(App))

  // In SSR the imported logo resolves to its source path; the browser bundle uses the hashed built file. Make them identical.
  const assets = join(dist, 'assets')
  const bundle = readdirSync(assets).find((f) => f.endsWith('.js'))
  const builtLogo = readFileSync(join(assets, bundle), 'utf8').match(/\/assets\/MedToken(?:%20| )Logo-[\w-]+\.png/)
  if (!builtLogo) throw new Error('could not find the built logo path in the bundle')
  for (const dev of ['/src/assets/MedToken Logo.png', '/src/assets/MedToken%20Logo.png']) appHtml = appHtml.split(dev).join(builtLogo[0])

  const file = join(dist, 'index.html')
  let html = readFileSync(file, 'utf8')
  const start = html.indexOf('<!--app-html-->')
  const end = html.indexOf('<!--/app-html-->')
  if (start === -1 || end === -1) throw new Error('app-html markers missing from dist/index.html')
  html = html.slice(0, start) + appHtml + html.slice(end + '<!--/app-html-->'.length)
  html = html.replace('<div id="root">', '<div id="root" data-prerendered="true">')
  writeFileSync(file, html)
  console.log(`prerendered ${(appHtml.length / 1024).toFixed(1)} kB of HTML into dist/index.html`)
} finally {
  await server.close()
}
