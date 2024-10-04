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
    access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET ?? '',
    refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET ?? '',
    verify_token_secret: process.env.JWT_VERIFY_TOKEN_SECRET ?? '',
    forgot_password_token_secret: process.env.JWT_FORGOT_PASSWORD_TOKEN_SECRET ?? '',
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
