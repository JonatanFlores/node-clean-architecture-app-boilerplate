import { LoadUserAccount, SaveUserAccount, SaveUserToken } from '@/domain/contracts/repos/mongo'
import { EmailAlreadyInUseError } from '@/domain/entities/errors'
import { AccessToken, RefreshToken } from '@/domain/entities'
import { Hasher, Mail, TokenGenerator } from '@/domain/contracts/gateways'

import path from 'path'

type Setup = (userAccountRepo: LoadUserAccount & SaveUserAccount, userTokenRepo: SaveUserToken, hasher: Hasher, token: TokenGenerator, mail: Mail) => AddUserAccount
type Input = { email: string, password: string }
type Output = { email: string, accessToken: string, refreshToken: string }
export type AddUserAccount = (input: Input) => Promise<Output>

export const setupAddUserAccount: Setup = (userAccountRepo, userTokenRepo, hasher, token, mail) => async ({ email, password }) => {
  const userAccount = await userAccountRepo.load({ email })
  if (userAccount !== undefined) throw new EmailAlreadyInUseError()
  const passwordHashed = await hasher.hash({ value: password })
  const isVerified = false
  const { id } = await userAccountRepo.save({ email, password: passwordHashed, isVerified })
  const accessToken = await token.generate({ key: id, expirationInMs: AccessToken.expirationInMs })
  const refreshToken = await token.generate({ key: id, expirationInMs: RefreshToken.expirationInMs })
  const { token: registerToken } = await userTokenRepo.save({ userId: id })
  const registerUserTemplate = path.resolve(__dirname, '../../../main/views/register-user-confirmation.hbs')
  await mail.send({
    from: {
      name: 'AppName',
      email: 'appname@mail.com'
    },
    to: {
      name: email,
      email
    },
    subject: '[AppName] Create Account Confirmation',
    templateData: {
      file: registerUserTemplate,
      variables: {
        email,
        link: `http://localhost:3000/confirm-registration?token=${String(registerToken)}`
      }
    }
  })
  return { email, accessToken, refreshToken }
}
