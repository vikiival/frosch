import { Button, Frog, TextInput } from 'frog'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'
// import { neynar } from 'frog/hubs'
import { createNeynar } from 'frog/middlewares'
import { magic } from './code'
// import { vars } from './ui'

const neynar = createNeynar({ apiKey: 'NEYNAR_FROG_FM' })
const neynarMiddleware = neynar.middleware({ features: ['cast'] })


export const app = new Frog({
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  // ui: { vars }
}).use(neynarMiddleware)

// app.route('/', gallery)
app.frame('/', neynarMiddleware, async (c) => {
  // const { buttonValue, inputText, status } = c
  let cast = c.var.cast?.text

  if (!cast) {
    cast = magic
  }

  const image = await fetch('http://127.0.0.1:3000/magic', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cast }),
  }).then((res) => res.arrayBuffer())

  console.log('image', image)

  return c.res({
    title: 'KodaDot',
    // image: 'https://raw.githubusercontent.com/kodadot/kodadot-presskit/main/pre-v4/png/lightsquare_V4.png',
    image: <img src={image as any} />,
    browserLocation: "https://kodadot.xyz",
    imageAspectRatio: '1:1',
    intents: [
      // <TextInput placeholder="Enter your kodadot.url" />,
      // <Button action="/poap/submit" value={`ahp/${collection.id}/denver`}>
      //   Mint
      // </Button>
      <Button.Link href="https://kodadot.xyz">kodadot</Button.Link>
    ],
  })
})

app.frame('/main', (c) => {
  const { buttonValue, inputText, status } = c
  const fruit = inputText || buttonValue
  return c.res({
    image: (
      <div
        style={{
          alignItems: 'center',
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          justifyContent: 'center',
          textAlign: 'center',
          width: '100%',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {status === 'response'
            ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ''}`
            : 'Welcome!'}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter custom fruit..." />,
      <Button value="apples">Apples</Button>,
      <Button value="oranges">Oranges</Button>,
      <Button value="bananas">Bananas</Button>,
      status === 'response' && <Button.Reset>Reset</Button.Reset>,
    ],
  })
})

const isCloudflareWorker = typeof caches !== 'undefined'
if (isCloudflareWorker) {
  const manifest = await import('__STATIC_CONTENT_MANIFEST')
  const serveStaticOptions = { manifest, root: './' }
  app.use('/*', serveStatic(serveStaticOptions))
  devtools(app, { assetsPath: '/frog', serveStatic, serveStaticOptions })
} else {
  devtools(app, { serveStatic })
}

export default app
