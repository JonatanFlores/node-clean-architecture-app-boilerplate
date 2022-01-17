import { Middleware } from '@/application/middlewares'
import { forbidden, HttpResponse, ok, tokenExpired, tokenInvalid } from '@/application/helpers'
import { RequiredStringValidator } from '@/application/validation'

import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

type HttpRequest = { authorization: string }
type Model = Error | { userId: string }
type Authorize = (input: { token: string }) => Promise<string>

export class AuthenticationMiddleware implements Middleware {
  constructor (private readonly authorize: Authorize) {}

  async handle ({ authorization }: HttpRequest): Promise<HttpResponse<Model>> {
    authorization = authorization?.replace('Bearer ', '')
    if (!this.validate({ authorization })) return forbidden()
    try {
      const userId = await this.authorize({ token: authorization })
      return ok({ userId })
    } catch (error) {
      if (error instanceof TokenExpiredError) return tokenExpired()
      if (error instanceof JsonWebTokenError) return tokenInvalid()
      return forbidden()
    }
  }

  private validate ({ authorization }: HttpRequest): boolean {
    const error = new RequiredStringValidator(authorization, 'authorization').validate()
    return error === undefined
  }
}
