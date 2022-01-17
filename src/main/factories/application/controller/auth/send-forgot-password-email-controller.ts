import { SendForgotPasswordEmailController } from '@/application/controllers'
import { makeSendForgotPasswordEmail } from '@/main/factories/domain/usecases/auth'

export const makeSendForgotPasswordEmailController = (): SendForgotPasswordEmailController => {
  return new SendForgotPasswordEmailController(
    makeSendForgotPasswordEmail()
  )
}
