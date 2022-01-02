import { LoadUserAccount, SaveUserAccount } from '@/domain/contracts/repos/mongo'
import { EmailAlreadyInUseError } from '@/domain/entities/errors'
import { AccessToken, RefreshToken } from '@/domain/entities'
import { Hasher, TokenGenerator } from '@/domain/contracts/gateways'

type Setup = (userAccountRepo: LoadUserAccount & SaveUserAccount, hasher: Hasher, token: TokenGenerator) => AddUserAccount
type Input = { email: string, password: string }
type Output = { email: string, accessToken: string, refreshToken: string }
export type AddUserAccount = (input: Input) => Promise<Output>

export const setupAddUserAccount: Setup = (userAccountRepo, hasher, token) => async ({ email, password }) => {
  const userAccount = await userAccountRepo.load({ email })
  if (userAccount !== undefined) throw new EmailAlreadyInUseError()
  const passwordHashed = await hasher.hash({ value: password })
  const { id } = await userAccountRepo.save({ email, password: passwordHashed })
  const accessToken = await token.generate({ key: id, expirationInMs: AccessToken.expirationInMs })
  const refreshToken = await token.generate({ key: id, expirationInMs: RefreshToken.expirationInMs })
  return { email, accessToken, refreshToken }
}
