import { BaseController } from '@/application/controllers'
import { HttpResponse, ok } from '@/application/helpers'
import { ValidationBuilder as Builder, Validator } from '@/application/validation'
import { SendForgotPasswordEmail } from '@/domain/usecases'

type HttpRequest = { email: string }
type Model = { message: string }

export class SendForgotPasswordEmailController extends BaseController {
  constructor (private readonly sendForgotPasswordEmail: SendForgotPasswordEmail) {
    super()
  }

  async perform ({ email }: HttpRequest): Promise<HttpResponse<Model>> {
    await this.sendForgotPasswordEmail({ email })
    return ok({ message: 'Forgot password email was sent, please check your inbox' })
  }

  override buildValidators ({ email }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: email, fieldName: 'email' }).required().email().build()
    ]
  }
}
