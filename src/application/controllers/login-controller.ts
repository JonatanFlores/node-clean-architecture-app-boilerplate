import { HttpResponse, badRequest, ok, unauthorized, serverError } from '@/application/helpers'
import { AuthenticationError } from '@/domain/entities/errors'
import { Authentication } from '@/domain/usecases'

type HttpRequest = { email: string, password: string }
type Model = Error | { accessToken: string }

export class LoginController {
  constructor (private readonly authentication: Authentication) {}

  async handle ({ email, password }: HttpRequest): Promise<HttpResponse<Model>> {
    const error = this.validate({ email, password })
    if (error !== undefined) {
      return badRequest(error)
    }
    try {
      const accessToken = await this.authentication({ email, password })
      return ok(accessToken)
    } catch (error) {
      if (error instanceof AuthenticationError) return unauthorized()
      return serverError(error)
    }
  }

  private validate ({ email, password }: HttpRequest): Error | undefined {
    if (email === '' || email === null || email === undefined) {
      return new Error('The email field is required')
    }
    if (password === '' || password === null || password === undefined) {
      return new Error('The password field is required')
    }
  }
}
