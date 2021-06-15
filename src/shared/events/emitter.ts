import { EventEmitter } from 'events'

const eventEmitter = new EventEmitter()

eventEmitter.on('error', (err) => {
  console.error('[ERROR] EVENT_LISTENER_FAILED:', err)
})

export default eventEmitter
