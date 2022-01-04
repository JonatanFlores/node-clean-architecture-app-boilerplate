import { RefreshTokenController } from '@/application/controllers'
import { makeRefreshToken } from '@/main/factories/domain/usecases'

export const makeRefreshTokenController = (): RefreshTokenController => {
  return new RefreshTokenController(makeRefreshToken())
}
