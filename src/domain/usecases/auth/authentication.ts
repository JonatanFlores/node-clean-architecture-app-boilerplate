import { LoadUserAccount } from '@/domain/contracts/repos/mongo'
import { HashComparer, TokenGenerator } from '@/domain/contracts/gateways'
import { AccessToken, RefreshToken } from '@/domain/entities'
import { AuthenticationError } from '@/domain/entities/errors'

type Setup = (userAccountRepo: LoadUserAccount, hashComparer: HashComparer, token: TokenGenerator) => Authentication
type Input = { email: string, password: string }
type Output = { email: string, accessToken: string, refreshToken: string }
export type Authentication = (input: Input) => Promise<Output>

export const setupAuthentication: Setup = (userAccountRepo, hashComparer, token) => async ({ email, password }) => {
  const userAccount = await userAccountRepo.load({ email })
  if (userAccount === undefined) throw new AuthenticationError()
  const isValid = await hashComparer.compare({ plaintext: password, digest: userAccount.password })
  if (!isValid) throw new AuthenticationError()
  const accessToken = await token.generate({ key: userAccount.id, expirationInMs: AccessToken.expirationInMs })
  const refreshToken = await token.generate({ key: userAccount.id, expirationInMs: RefreshToken.expirationInMs })
  return { email, accessToken, refreshToken }
}
