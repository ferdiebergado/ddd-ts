export default {
  web: {
    http: {
      host: process.env.HOST || 'localhost',
      port: process.env.PORT || 1995,
      baseUrl: '/api',
      cors: {
        origin: process.env.CLIENT || '*',
        headers:
          'Origin, X-Requested-With, Content-Type, Accept, Authorization',
        methods: 'PUT, POST, PATCH, DELETE, GET',
      },
    },
  },
  db: {
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017',
      dbName:
        process.env.NODE_ENV === 'production'
          ? process.env.MONGODB_NAME
          : 'test',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
  },
  security: {
    key:
      process.env.KEY ||
      'YjU0OGE1ZGE0YTA0ZDE0YjlhNmU1ZTdlMjFiYTI1MmU3ZjBmM2M5M2IyNzUzMTg5YTU1MTAyZDllODNlNTUzNAo=',
    hash: {
      algorithm: process.env.CRYPTO_ALGORITHM || 'sha512',
    },
    jwt: {
      options: {
        algorithm: 'HS256',
        expiresIn: 60 * 60 * 30,
      },
    },
  },
  mail: {
    development: {
      host: '127.0.0.1',
      port: 1025,
    },
    production: {
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        type: 'OAuth2',
        user: process.env.GMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        accessToken: process.env.GMAIL_ACCESS_TOKEN,
        refreshToken: process.env.GMAIL_REFRESH_TOKEN,
        expires: 1484314697598,
      },
    },
    from: 'mail@localhost.test',
  },
};
