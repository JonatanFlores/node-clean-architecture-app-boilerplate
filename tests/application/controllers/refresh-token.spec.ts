import { RequiredStringValidator, Validator, ValidationBuilder as Builder } from '@/application/validation'
import { HttpResponse, ok } from '@/application/helpers'
import { RefreshTokenType } from '@/domain/usecases'

type HttpRequest = { refreshToken: string }
type Model = { email: string, accessToken: string, refreshToken: string }

class RefreshTokenController {
  constructor (private readonly refreshToken: RefreshTokenType) {}

  async handle ({ refreshToken }: HttpRequest): Promise<HttpResponse<Model>> {
    const result = await this.refreshToken({ currentRefreshToken: refreshToken })
    return ok(result)
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

  test('should return 200 if RefreshToken succeeds', async () => {
    const httpResponse = await sut.handle({ refreshToken })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { email, accessToken, refreshToken }
    })
  })
})
