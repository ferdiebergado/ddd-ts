import path from 'path'
import fs from 'fs'

const file = path.resolve(process.cwd(), 'app.log')

const log = (msg: string): void => {
  fs.appendFile(file, msg, (err) => {
    if (err) return log(err.stack!)
  })
}

export default (
  level: 'info' | 'debug' | 'error' | 'warning',
  msg: string | Record<string, unknown> | Error
): void => {
  const timestamp = new Date().toISOString()
  let logEntry = `[${level.toUpperCase()}] ${timestamp} ${msg}\n`
  if (msg instanceof Error) {
    logEntry += msg.stack!
  }
  if (typeof msg === 'object') {
    logEntry += JSON.stringify(msg)
  }
  log(`${logEntry}\n`)
}
