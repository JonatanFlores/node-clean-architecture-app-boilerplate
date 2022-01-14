import { Mail } from '@/domain/contracts/gateways'
import { LoadUserAccount, SaveUserToken } from '@/domain/contracts/repos/mongo'

type Setup = (userAccount: LoadUserAccount, userToken: SaveUserToken, mail: Mail, to: string, body: string) => SendForgotPasswordEmail
type Input = { email: string }
export type SendForgotPasswordEmail = (input: Input) => Promise<void>

export const setupSendForgotPasswordEmail: Setup = (userAccount, userToken, mail, to, body) => async ({ email }) => {
  const userAccountData = await userAccount.load({ email })
  if (userAccountData !== undefined) {
    const { id } = userAccountData
    await userToken.save({ userId: id })
    await mail.send({ to, body })
  }
}
