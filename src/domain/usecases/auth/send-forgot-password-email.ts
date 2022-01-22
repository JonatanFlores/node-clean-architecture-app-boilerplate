import { Mail } from '@/domain/contracts/gateways'
import { LoadUserAccount, SaveUserToken } from '@/domain/contracts/repos/mongo'

import path from 'path'

type Setup = (userAccount: LoadUserAccount, userToken: SaveUserToken, env: Env, mail: Mail) => SendForgotPasswordEmail
type Env = { [key: string]: any }
type Input = { email: string }
export type SendForgotPasswordEmail = (input: Input) => Promise<void>

export const setupSendForgotPasswordEmail: Setup = (userAccount, userToken, env, mail) => async ({ email }) => {
  const userAccountData = await userAccount.load({ email })
  if (userAccountData !== undefined) {
    const { id } = userAccountData
    const { token } = await userToken.save({ userId: id })
    const forgotPasswordTemplate = path.resolve(__dirname, '../../../main/views/forgot-password.hbs')
    await mail.send({
      from: {
        name: env.mail.defaults.from.name,
        email: env.mail.defaults.from.email
      },
      to: {
        name: userAccountData.email,
        email: userAccountData.email
      },
      subject: `[${String(env.appName)}] Password Recovery`,
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          email,
          appName: env.appName,
          link: `${String(env.frontendUrl)}/reset-password?token=${token}`
        }
      }
    })
  }
}
