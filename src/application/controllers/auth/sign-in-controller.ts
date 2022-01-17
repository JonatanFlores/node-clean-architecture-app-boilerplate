import { Controller } from '@/application/controllers'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { AuthenticationError } from '@/domain/entities/errors'
import { Authentication } from '@/domain/usecases'
import { ValidationBuilder as Builder, Validator } from '@/application/validation'

type HttpRequest = { email: string, password: string }
type Model = Error | { email: string, accessToken: string, refreshToken: string }

export class SignInController extends Controller {
  constructor (private readonly authentication: Authentication) {
    super()
  }

  async perform ({ email, password }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.authentication({ email, password })
      return ok(accessToken)
    } catch (error) {
      if (error instanceof AuthenticationError) return unauthorized()
      throw error
    }
  }

  override buildValidators ({ email, password }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: email, fieldName: 'email' }).required().build(),
      ...Builder.of({ value: password, fieldName: 'password' }).required().build()
    ]
  }
}
