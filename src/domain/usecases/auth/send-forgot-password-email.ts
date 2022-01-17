import { Mail } from '@/domain/contracts/gateways'
import { LoadUserAccount, SaveUserToken } from '@/domain/contracts/repos/mongo'

type Setup = (userAccount: LoadUserAccount, userToken: SaveUserToken, mail: Mail) => SendForgotPasswordEmail
type Input = { email: string }
export type SendForgotPasswordEmail = (input: Input) => Promise<void>

export const setupSendForgotPasswordEmail: Setup = (userAccount, userToken, mail) => async ({ email }) => {
  const userAccountData = await userAccount.load({ email })
  if (userAccountData !== undefined) {
    const { id } = userAccountData
    const { token } = await userToken.save({ userId: id })
    const body = `Password recovery request: ${token}`
    await mail.send({ to: email, body })
  }
}
