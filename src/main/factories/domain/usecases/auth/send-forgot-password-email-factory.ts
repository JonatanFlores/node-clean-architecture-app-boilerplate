import { SendForgotPasswordEmail, setupSendForgotPasswordEmail } from '@/domain/usecases'
import { env } from '@/main/config/env'
import { makeMongoUserAccountRepository, makeMongoUserTokenRepository } from '@/main/factories/infra/repos/mongo'
import { makeMailerAdapter } from '@/main/factories/shared/adapters/mail'

export const makeSendForgotPasswordEmail = (): SendForgotPasswordEmail => {
  return setupSendForgotPasswordEmail(
    makeMongoUserAccountRepository(),
    makeMongoUserTokenRepository(),
    env,
    makeMailerAdapter()
  )
}
