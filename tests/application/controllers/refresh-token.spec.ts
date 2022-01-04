import { RequiredStringValidator, Validator, ValidationBuilder as Builder } from '@/application/validation'
import { HttpResponse, ok, unauthorized } from '@/application/helpers'
import { UnauthorizedError } from '@/application/errors'
import { RefreshTokenType } from '@/domain/usecases'
import { AuthenticationError } from '@/domain/entities/errors'

type HttpRequest = { refreshToken: string }
type Model = Error | { email: string, accessToken: string, refreshToken: string }

class RefreshTokenController {
  constructor (private readonly refreshToken: RefreshTokenType) {}

  async handle ({ refreshToken }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const result = await this.refreshToken({ currentRefreshToken: refreshToken })
      return ok(result)
    } catch (error) {
      if (error instanceof AuthenticationError) return unauthorized()
      throw error
    }
  }

  buildValidators ({ refreshToken }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: refreshToken, fieldName: 'refreshToken' }).required().build()
    ]
  }
}

describe('RefreshToken', () => {
  let email: string
  let accessToken: string
  let refreshToken: string
  let refreshTokenUseCase: jest.Mock
  let sut: RefreshTokenController

  beforeAll(() => {
    email = 'any_email@mail.com'
    accessToken = 'any_access_token'
    refreshToken = 'any_refresh_token'
    refreshTokenUseCase = jest.fn()
    refreshTokenUseCase.mockResolvedValue({ email, accessToken, refreshToken })
  })

  beforeEach(() => {
    sut = new RefreshTokenController(refreshTokenUseCase)
  })

  test('should build Validators correctly', () => {
    const validators = sut.buildValidators({ refreshToken: 'any_refresh_token' })

    expect(validators).toEqual([
      new RequiredStringValidator(refreshToken, 'refreshToken')
    ])
  })

  test('should call RefreshToken with correct input', async () => {
    await sut.handle({ refreshToken })

    expect(refreshTokenUseCase).toHaveBeenCalledWith({ currentRefreshToken: refreshToken })
    expect(refreshTokenUseCase).toHaveBeenCalledTimes(1)
  })

  test('should return 401 if RefreshToken fails', async () => {
    refreshTokenUseCase.mockRejectedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ refreshToken })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  test('should return 200 if RefreshToken succeeds', async () => {
    const httpResponse = await sut.handle({ refreshToken })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { email, accessToken, refreshToken }
    })
  })
})
