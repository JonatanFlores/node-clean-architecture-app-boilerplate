import { RefreshTokenType, setupRefreshToken } from '@/domain/usecases'
import { makeMongoUserRepo } from '@/main/factories/infra/repos/mongo'
import { makeJwtTokenHandler } from '@/main/factories/infra/gateways'

export const makeRefreshToken = (): RefreshTokenType => {
  return setupRefreshToken(
    makeJwtTokenHandler(),
    makeMongoUserRepo()
  )
}
