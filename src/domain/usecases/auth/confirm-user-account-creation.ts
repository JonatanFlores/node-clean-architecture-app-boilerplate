import { DateDifferenceInHours } from '@/domain/contracts/gateways'
import { ChangeUserAccountVerificationStatus, LoadUser, LoadUserToken } from '@/domain/contracts/repos/mongo'
import { ConfirmUserAccountTokenExpiredError, ConfirmUserAccountTokenNotFoundError, UserNotFoundError } from '@/domain/entities/errors'

type Setup = (userRepo: LoadUser, userAccountRepo: ChangeUserAccountVerificationStatus, userTokenRepo: LoadUserToken, dateAdapter: DateDifferenceInHours) => ConfirmUserAccountCreation
type Input = { token: string }
export type ConfirmUserAccountCreation = (input: Input) => Promise<void>

export const setupConfirmUserAccountCreation: Setup = (userRepo, userAccountRepo, userTokenRepo, dateAdapter) => async ({ token }) => {
  const userToken = await userTokenRepo.load({ token })
  if (userToken === undefined) throw new ConfirmUserAccountTokenNotFoundError()
  const { userId, createdAt } = userToken
  const tokenExpirationLimitInHours = 2
  const tokenCreationInHours = dateAdapter.diffInHours(new Date(createdAt), new Date())
  if (tokenCreationInHours > tokenExpirationLimitInHours) throw new ConfirmUserAccountTokenExpiredError()
  const user = await userRepo.load({ id: userId })
  if (user === undefined) throw new UserNotFoundError()
  const { id } = user
  await userAccountRepo.changeIsVerified({ id, isVerified: true })
}
