import { Controller } from '@/application/controllers'
import { Validator, ValidationBuilder as Builder } from '@/application/validation'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { RefreshTokenType } from '@/domain/usecases'
import { RefreshTokenError } from '@/domain/entities/errors'

type HttpRequest = { refreshToken: string }
type Model = Error | { email: string, accessToken: string, refreshToken: string }

export class RefreshTokenController extends Controller {
  constructor (private readonly refreshToken: RefreshTokenType) {
    super()
  }

  async perform ({ refreshToken }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const result = await this.refreshToken({ currentRefreshToken: refreshToken })
      return ok(result)
    } catch (error) {
      if (error instanceof RefreshTokenError) return unauthorized()
      throw error
    }
  }

  override buildValidators ({ refreshToken }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: refreshToken, fieldName: 'refreshToken' }).required().build()
    ]
  }
}
