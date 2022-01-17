import { RefreshTokenType, setupRefreshToken } from '@/domain/usecases'
import { makeMongoUserRepo } from '@/main/factories/infra/repos/mongo'
import { makeJwtTokenHandler } from '@/main/factories/shared/adapters/security'

export const makeRefreshToken = (): RefreshTokenType => {
  return setupRefreshToken(
    makeJwtTokenHandler(),
    makeMongoUserRepo()
  )
}
