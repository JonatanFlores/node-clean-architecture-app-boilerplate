import { Controller } from '@/application/controllers'
import { badRequest, HttpResponse, ok } from '@/application/helpers'
import { ValidationBuilder as Build, Validator } from '@/application/validation'
import { EmailAlreadyInUseError } from '@/domain/entities/errors'
import { AddUserAccount } from '@/domain/usecases'

type HttpRequest = { email: string, password: string }
type Model = Error | { email: string, accessToken: string, refreshToken: string }

export class SignupController extends Controller {
  constructor (private readonly addUserAccount: AddUserAccount) {
    super()
  }

  async perform ({ email, password }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const result = await this.addUserAccount({ email, password })
      return ok(result)
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) return badRequest(error)
      throw error
    }
  }

  override buildValidators ({ email, password }: HttpRequest): Validator[] {
    return [
      ...Build.of({ value: email, fieldName: 'email' }).required().build(),
      ...Build.of({ value: password, fieldName: 'password' }).required().build()
    ]
  }
}
