import { SendForgotPasswordEmail, setupSendForgotPasswordEmail } from '@/domain/usecases'
import { makeMongoUserAccountRepository, makeMongoUserTokenRepository } from '@/main/factories/infra/repos/mongo'
import { makeMailerAdapter } from '@/main/factories/shared/adapters/mail'

export const makeSendForgotPasswordEmail = (): SendForgotPasswordEmail => {
  return setupSendForgotPasswordEmail(
    makeMongoUserAccountRepository(),
    makeMongoUserTokenRepository(),
    makeMailerAdapter()
  )
}
