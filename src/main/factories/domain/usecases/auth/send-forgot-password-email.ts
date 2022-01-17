import { SendForgotPasswordEmail, setupSendForgotPasswordEmail } from '@/domain/usecases'
import { makeAmazonSesAdapter } from '@/main/factories/shared/adapters/mail'
import { makeMongoUserAccountRepository, makeMongoUserTokenRepository } from '@/main/factories/infra/repos/mongo'

export const makeSendForgotPasswordEmail = (): SendForgotPasswordEmail => {
  const to = 'any'
  const body = 'any'
  return setupSendForgotPasswordEmail(
    makeMongoUserAccountRepository(),
    makeMongoUserTokenRepository(),
    makeAmazonSesAdapter(),
    to,
    body
  )
}
