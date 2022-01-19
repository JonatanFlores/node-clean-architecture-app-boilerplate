import { Mail } from '@/domain/contracts/gateways'
import { LoadUserAccount, SaveUserToken } from '@/domain/contracts/repos/mongo'

import path from 'path'

type Setup = (userAccount: LoadUserAccount, userToken: SaveUserToken, mail: Mail) => SendForgotPasswordEmail
type Input = { email: string }
export type SendForgotPasswordEmail = (input: Input) => Promise<void>

export const setupSendForgotPasswordEmail: Setup = (userAccount, userToken, mail) => async ({ email }) => {
  const userAccountData = await userAccount.load({ email })
  if (userAccountData !== undefined) {
    const { id } = userAccountData
    const { token } = await userToken.save({ userId: id })
    const forgotPasswordTemplate = path.resolve(__dirname, '../../../views/forgot-password.hbs')
    await mail.send({
      from: {
        name: 'AppName',
        email: 'appname@mail.com'
      },
      to: {
        name: userAccountData.email,
        email: userAccountData.email
      },
      subject: '[AppName] Password Recovery',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          email,
          link: `http://localhost:3000/reset-password?token=${token}`
        }
      }
    })
  }
}
