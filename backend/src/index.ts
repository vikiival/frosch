import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { writeFile } from 'fs/promises'
import { Hono } from 'hono'
import puppeteer from 'puppeteer-core'
import { code } from './codes'
import { cors } from 'hono/cors'
import { sha256 } from 'ohash'

const app = new Hono()

app.use('*', cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

const performCanvasCapture = async (page: any, canvasSelector: string) => {
  try {
    // get the base64 image from the CANVAS targetted
    const base64 = await page.$eval(canvasSelector, (el: any) => {
      if (!el || el.tagName !== 'CANVAS') return null
      return el.toDataURL()
    })
    if (!base64) throw new Error('No canvas found')
    // remove the base64 mimetype at the beginning of the string
    const pureBase64 = base64.replace(/^data:image\/png;base64,/, '')
    return Buffer.from(pureBase64, 'base64')
  } catch (err) {
    return null
  }
}

app.post('/magic', async (c) => {
  // const hash = '0x' + sha256(Date.now().toString())
  const magic = await c.req.json()

  await writeFile('./public/magic.js', magic.cast)

  const browser = await puppeteer.launch({
    headless: 'shell',
    executablePath:
      '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  })

  // call pupeeter to render the image

  const page = await browser.newPage()

  await page.setViewport({ width: 600, height: 600 })

  await page.goto(`http://localhost:3000/public`)

  await page.$eval('script[src="./public/magic.js"]', e => e.setAttribute("src", "./public/sketch.js"))

  const selector = 'canvas'

  await page.waitForSelector(selector)

  const element = await performCanvasCapture(page, selector) // const element = page.$(selector)

  const data = element

  await browser.close()

  // return c({ data })
  // response is a image
  c.header('Cache-Control', 's-maxage=10, stale-while-revalidate')
  c.header('Content-Type', 'image/png')
  // CORS
  c.header('Access-Control-Allow-Headers', '*')
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  c.header(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  )
  return c.body(data)
})

app.use('/public/*', serveStatic({ root: './' }))
app.use('/dynamic/*', serveStatic({ root: './' }))

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
