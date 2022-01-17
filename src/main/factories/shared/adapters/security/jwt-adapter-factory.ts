import { JwtAdapter } from '@/shared/adapters/security'
import { env } from '@/main/config/env'

export const makeJwtAdapter = (): JwtAdapter => {
  return new JwtAdapter(env.jwtSecret)
}
