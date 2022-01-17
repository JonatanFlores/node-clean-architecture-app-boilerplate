import { RefreshTokenType, setupRefreshToken } from '@/domain/usecases'
import { makeMongoUserRepository } from '@/main/factories/infra/repos/mongo'
import { makeJwtAdapter } from '@/main/factories/shared/adapters/security'

export const makeRefreshToken = (): RefreshTokenType => {
  return setupRefreshToken(
    makeJwtAdapter(),
    makeMongoUserRepository()
  )
}
