export const env = {
  port: process.env.PORT ?? 3333,
  appEnv: process.env.NODE_ENV ?? 'development',
  mongoUrl: process.env.MONGO_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  frontendUrl: process.env.FRONTEND_URL ?? '',
  mail: {
    driver: process.env.MAIL_DRIVER ?? 'ethereal'
  }
}
