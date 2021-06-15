import path from 'path'
import { readFileSync } from 'fs'

export default ((): void => {
  try {
    const file = path.resolve(process.cwd(), '.env')
    const data = readFileSync(file, 'utf-8')
    const lines = data.split('\n')
    lines.forEach((line) => {
      if (line && line.charAt(0) !== '#') {
        const index = line.indexOf('=')
        const key = line.substr(0, index)
        const val = line.substr(index + 1)
        if (!process.env[key]) {
          process.env[key] = val
        }
      }
    })
    console.log('Loaded environment variables.')
  } catch (e) {
    console.error('[ERROR]', e)
    console.log('Cannot load environment variables.')
  }
})()
