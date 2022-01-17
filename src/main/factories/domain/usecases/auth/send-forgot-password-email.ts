import { SendForgotPasswordEmail, setupSendForgotPasswordEmail } from '@/domain/usecases'
import { makeAmazonSesHandler } from '@/main/factories/infra/gateways'
import { makeMongoUserAccountRepo, makeMongoUserTokenRepo } from '@/main/factories/infra/repos/mongo'

export const makeSendForgotPasswordEmail = (): SendForgotPasswordEmail => {
  const to = 'any'
  const body = 'any'
  return setupSendForgotPasswordEmail(
    makeMongoUserAccountRepo(),
    makeMongoUserTokenRepo(),
    makeAmazonSesHandler(),
    to,
    body
  )
}
