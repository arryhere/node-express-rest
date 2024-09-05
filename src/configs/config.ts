import 'dotenv/config';

export const config = {
  app: {
    env: process.env.APP_ENV ?? '',
    port: process.env.PORT ?? '',
  },
  db: {
    uri: process.env.MONGODB_URI ?? '',
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? '',
  },
};
