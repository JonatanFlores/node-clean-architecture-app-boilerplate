import { Controller } from '@/application/controllers'
import { HttpResponse, ok } from '@/application/helpers'
import { ValidationBuilder as Builder, Validator } from '@/application/validation'
import { SendForgotPasswordEmail } from '@/domain/usecases'

type HttpRequest = { email: string }
type Model = { message: string }

export class SendForgotPasswordEmailController extends Controller {
  constructor (private readonly sendForgotPasswordEmail: SendForgotPasswordEmail) {
    super()
  }

  async perform ({ email }: HttpRequest): Promise<HttpResponse<Model>> {
    await this.sendForgotPasswordEmail({ email })
    return ok({ message: 'OK' })
  }

  override buildValidators ({ email }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: email, fieldName: 'email' }).required().email().build()
    ]
  }
}
