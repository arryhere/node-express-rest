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
    auth_secret: process.env.JWT_AUTH_SECRET ?? '',
    forgot_password_secret: process.env.JWT_FORGOT_PASSWORD_SECRET ?? '',
  },
  smtp: {
    host: process.env.SMTP_HOST ?? '',
    port: Number(process.env.SMTP_PORT) ?? 0,
    username: process.env.SMTP_USERNAME ?? '',
    password: process.env.SMTP_PASSWORD ?? '',
  },

  email: {
    from: process.env.EMAIL_FROM ?? '',
  },
};
