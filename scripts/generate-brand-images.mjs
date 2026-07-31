import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const workspaceRoot = resolve(import.meta.dirname, '..')

const derivatives = [
  {
    source: 'docs/kings_private_1.jpg',
    output: 'public/images/brand/heroes/kings-private-landscape-960.jpg',
    width: 960,
    height: 640,
    quality: 82,
  },
  {
    source: 'docs/kings_private_1.jpg',
    output: 'public/images/brand/heroes/kings-private-landscape-1600.jpg',
    width: 1600,
    height: 1067,
    quality: 84,
  },
  {
    source: 'docs/Hero_portrait.jpg',
    output: 'public/images/brand/heroes/kings-private-portrait-720.jpg',
    width: 720,
    height: 1080,
    quality: 82,
  },
  {
    source: 'docs/Hero_portrait.jpg',
    output: 'public/images/brand/heroes/kings-private-portrait-1080.jpg',
    width: 1080,
    height: 1620,
    quality: 84,
  },
]

const browser = await chromium.launch({ headless: true })

try {
  for (const derivative of derivatives) {
    const sourcePath = resolve(workspaceRoot, derivative.source)
    const outputPath = resolve(workspaceRoot, derivative.output)
    await mkdir(dirname(outputPath), { recursive: true })

    const page = await browser.newPage({
      viewport: { width: derivative.width, height: derivative.height },
      deviceScaleFactor: 1,
    })
    await page.goto(pathToFileURL(sourcePath).href, { waitUntil: 'load' })
    await page.locator('img').evaluate((image) => {
      document.documentElement.style.cssText = 'margin:0;width:100%;height:100%;overflow:hidden;background:#14284b'
      document.body.style.cssText = 'margin:0;width:100%;height:100%;overflow:hidden'
      image.style.cssText = 'display:block;width:100vw;height:100vh;max-width:none;object-fit:cover;object-position:center'
    })
    await page.screenshot({
      path: outputPath,
      type: 'jpeg',
      quality: derivative.quality,
      fullPage: false,
    })
    await page.close()
    console.log(`Generated ${derivative.output} (${derivative.width}x${derivative.height})`)
  }
} finally {
  await browser.close()
}
