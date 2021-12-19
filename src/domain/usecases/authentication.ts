import { LoadUserAccount } from '@/domain/repos/mongo'
import { HashComparer, TokenGenerator } from '@/domain/gateways'
import { AccessToken } from '@/domain/entities'
import { AuthenticationError } from '@/domain/errors'

type Setup = (userAccountRepo: LoadUserAccount, hashComparer: HashComparer, token: TokenGenerator) => Authentication
type Input = { email: string, password: string }
type Output = { accessToken: string }
export type Authentication = (input: Input) => Promise<Output>

export const setupAuthentication: Setup = (userAccountRepo, hashComparer, token) => async ({ email, password }) => {
  const userAccount = await userAccountRepo.load({ email })
  if (userAccount === undefined) throw new AuthenticationError()
  const isValid = await hashComparer.compare(password, userAccount.password)
  if (!isValid) throw new AuthenticationError()
  const accessToken = await token.generate({ key: userAccount.id, expirationInMs: AccessToken.expirationInMs })
  return { accessToken }
}
