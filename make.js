#!/usr/bin/env node
/**
 * Requires:
 *
 * * esbuild
 * * node-stdlib-browser
 */
/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require('esbuild')
const isDev = process.argv.filter(a => a === '--dev').length > 0
const isBrowser = process.argv.filter(a => a === '--browser').length > 0
const isMinify = process.argv.filter(a => a === '--minify').length > 0
const entryPoints = process.argv.splice(2).filter(p => !/^--/.test(p))

const pkg = JSON.parse(require('fs').readFileSync('./package.json'))

async function run() {
  await esbuild.build({
    bundle: true,
    define: isBrowser
      ? {
          global: 'window'
        }
      : {},
    entryPoints: entryPoints.length ? entryPoints : ['src/index.ts'],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
    inject: [require.resolve('node-stdlib-browser/helpers/esbuild/shim')],
    minify: isMinify,
    outdir: entryPoints.length ? 'dist/' : undefined,
    outfile: entryPoints.length ? undefined : 'dist/index.js',
    platform: isBrowser ? 'browser' : 'node',
    plugins: isBrowser
      ? [
          require('node-stdlib-browser/helpers/esbuild/plugin')(require('node-stdlib-browser'))
        ]
      : [
        ],
    sourcemap: 'external',
  }).catch((err) => { console.error(err); process.exit(1) })

  if (isDev) {
    console.error("\033[31;1;4mWARNING: Dev mode currently not supported\033[0m")
  }
}

run()
