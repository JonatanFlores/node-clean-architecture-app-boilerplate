import { Controller } from '@/application/controllers'
import { HttpResponse, ok } from '@/application/helpers'
import { ValidationBuilder as Build, Validator } from '@/application/validation'
import { AddUserAccount } from '@/domain/usecases'

type HttpRequest = { email: string, password: string }
type Model = Error | { email: string, accessToken: string }

export class SignupController extends Controller {
  constructor (private readonly addUserAccount: AddUserAccount) {
    super()
  }

  async perform ({ email, password }: HttpRequest): Promise<HttpResponse<Model>> {
    const result = await this.addUserAccount({ email, password })
    return ok(result)
  }

  override buildValidators ({ email, password }: HttpRequest): Validator[] {
    return [
      ...Build.of({ value: email, fieldName: 'email' }).required().build(),
      ...Build.of({ value: password, fieldName: 'password' }).required().build()
    ]
  }
}
