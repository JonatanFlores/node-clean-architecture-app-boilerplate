import { AuthenticationMiddleware } from '@/application/middlewares'
import { makeJwtAdapter } from '@/main/factories/shared/adapters/security'

export const makeAuthenticationMiddleware = (): AuthenticationMiddleware => {
  const jwt = makeJwtAdapter()
  return new AuthenticationMiddleware(jwt.validate.bind(jwt))
}
