import { ChangeUserAccountPassword, LoadUser, LoadUserToken } from '@/domain/contracts/repos/mongo'
import { DateDifferenceInHours, Hasher } from '@/domain/contracts/gateways'
import { ResetPasswordTokenExpiredError, ResetPasswordTokenNotFoundError, UserNotFoundError } from '@/domain/entities/errors'

type Setup = (userTokenRepo: LoadUserToken, userRepo: LoadUser, userAccount: ChangeUserAccountPassword, hasher: Hasher, dateHandler: DateDifferenceInHours) => ResetPassword
type Input = { token: string, password: string }
export type ResetPassword = (input: Input) => Promise<void>

export const setupResetPassword: Setup = (userTokenRepo, userRepo, userAccountRepo, hasher, dateHandler) => async ({ token, password }) => {
  const userToken = await userTokenRepo.load({ token })
  if (userToken === undefined) throw new ResetPasswordTokenNotFoundError()
  const { userId, createdAt } = userToken
  const tokenExpirationLimitInHours = 2
  const tokenCreationInHours = dateHandler.diffInHours(new Date(createdAt), new Date())
  if (tokenCreationInHours > tokenExpirationLimitInHours) throw new ResetPasswordTokenExpiredError()
  const user = await userRepo.load({ id: userId })
  if (user === undefined) throw new UserNotFoundError()
  const { id } = user
  const passwordHashed = await hasher.hash({ value: password })
  await userAccountRepo.changePassword({ id, password: passwordHashed })
}
