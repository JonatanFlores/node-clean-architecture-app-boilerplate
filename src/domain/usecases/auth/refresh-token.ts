import { TokenValidator, TokenGenerator } from '@/domain/contracts/gateways'
import { RefreshTokenError } from '@/domain/entities/errors'
import { AccessToken, RefreshToken } from '@/domain/entities'
import { LoadUser } from '@/domain/contracts/repos/mongo'

type Setup = (token: TokenValidator & TokenGenerator, userRepo: LoadUser) => RefreshTokenType
type Input = { currentRefreshToken: string }
type Output = { email: string, accessToken: string, refreshToken: string }
export type RefreshTokenType = (input: Input) => Promise<Output>

export const setupRefreshToken: Setup = (token, userRepo) => async ({ currentRefreshToken }) => {
  const userId = await token.validate({ token: currentRefreshToken })
  const user = await userRepo.load({ id: userId })
  if (user === undefined) throw new RefreshTokenError()
  const accessToken = await token.generate({ key: user.id, expirationInMs: AccessToken.expirationInMs })
  const refreshToken = await token.generate({ key: user.id, expirationInMs: RefreshToken.expirationInMs })
  return { email: user.email, accessToken, refreshToken }
}
