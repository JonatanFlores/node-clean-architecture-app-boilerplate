export const env = {
  port: process.env.PORT ?? 3333,
  appEnv: process.env.NODE_ENV ?? 'development',
  appName: process.env.APP_NAME ?? '',
  mongoUrl: process.env.MONGO_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  frontendUrl: process.env.FRONTEND_URL ?? '',
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? '',
    defaultRegion: process.env.AWS_DEFAULT_REGION ?? ''
  },
  mail: {
    driver: process.env.MAIL_DRIVER ?? 'ethereal',
    defaults: {
      from: {
        name: process.env.DEFAULT_MAIL_NAME ?? '',
        email: process.env.DEFAULT_MAIL_ADDRESS ?? ''
      }
    }
  }
}
