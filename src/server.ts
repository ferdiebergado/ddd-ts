import { Server } from 'http';
import Application from './app';
import expressApplication from './shared/web/http/express/express.application';
import config from './config';
import routes from './routes';
import DbConnection from './shared/persistence';

const PORT = config.web.http.port;
const app = new Application(expressApplication, routes);
const server = new Server(app.getRequestListener());

const cleanUp = async () => {
  console.log('Cleaning up...');

  await DbConnection.close();

  server.close((err) => {
    if (err) return console.error('[ERROR]', err);
    return console.log('Server closed.');
  });
};

process.on('uncaughtException', async (e) => {
  console.error('[ERROR] UNCAUGHT_EXCEPTION: ', e);
  await cleanUp();
  process.exit(1);
});

process.on('unhandledRejection', async (e) => {
  console.error('[ERROR] UNHANDLED_PROMISE_REJECTION: ', e);
  await cleanUp();
  process.exit(1);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Restarting server...');
  await cleanUp();
});

const connectDb = async () => {
  await DbConnection.testConnection();
  console.log('Database connected.');

  server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
};

connectDb().catch((err) => {
  console.error('[ERROR]', err);
  console.log('Cannot connect to the database.');
});
