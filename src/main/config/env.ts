export const env = {
  port: process.env.PORT ?? 3333,
  mongoUrl: process.env.MONGO_URL ?? '',
  jwtSecret: process.env.JWT_SECRET ?? ''
}
