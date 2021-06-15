import http from 'http'
import app from './app'
import config from './config'
import { dbConnection } from './shared/persistence'

const PORT = config.web.http.port
const server = http.createServer(app)

const cleanUp = async () => {
  console.log('Cleaning up...')

  await dbConnection.close()

  server.close((err) => {
    if (err) return console.error('[ERROR]', err)
    console.log('Server closed.')
  })
}

process.on('uncaughtException', async (e) => {
  console.error('[ERROR] UNCAUGHT_EXCEPTION: ', e)
  await cleanUp()
  process.exit(1)
})

process.on('unhandledRejection', async (e) => {
  console.error('[ERROR] UNHANDLED_PROMISE_REJECTION: ', e)
  await cleanUp()
  process.exit(1)
})

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Restarting server...')
  await cleanUp()
})

const connectDb = async () => {
  await dbConnection.testConnection()
  console.log('Database connected.')

  server.listen(PORT, () => console.log(`Listening on port ${PORT}...`))
}

connectDb().catch((err) => {
  console.error('[ERROR]', err)
  console.log('Cannot connect to the database.')
})
