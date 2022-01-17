import { JwtTokenHandler } from '@/shared/adapters/security'
import { env } from '@/main/config/env'

export const makeJwtTokenHandler = (): JwtTokenHandler => {
  return new JwtTokenHandler(env.jwtSecret)
}
