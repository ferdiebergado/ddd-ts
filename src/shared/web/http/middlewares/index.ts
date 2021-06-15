import cors from './cors.http.middleware'
import logger from './logger.http.middleware'
import trimmer from './trimmer.http.middleware'
import notFound from './404.http.middleware'

export { cors, logger, trimmer, notFound }
