import 'dotenv/config';

export const config = {
  app: {
    env: process.env.APP_ENV,
    port: process.env.PORT,
  },
};
