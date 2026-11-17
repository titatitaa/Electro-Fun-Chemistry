import { pathToFileURL } from 'node:url'
import { createApp } from './app.js'

export function startServer() {
  const port = Number(process.env.PORT || 3001)
  const { app, db } = createApp({ serveFrontend: process.env.NODE_ENV === 'production' })
  const server = app.listen(port, () => {
    console.log(`Chemistry Lab server listening on port ${port}`)
  })

  const shutdown = () => {
    server.close(() => {
      db.close()
      process.exit(0)
    })
  }
  process.on('SIGINT', shutdown)
  process.on('SIGTERM', shutdown)
  return server
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer()
}
