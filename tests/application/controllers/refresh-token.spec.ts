import { RequiredStringValidator, Validator, ValidationBuilder as Builder } from '@/application/validation'
import { RefreshTokenType } from '@/domain/usecases'

type HttpRequest = { refreshToken: string }

class RefreshTokenController {
  constructor (private readonly refreshToken: RefreshTokenType) {}

  async handle ({ refreshToken }: HttpRequest): Promise<void> {
    await this.refreshToken({ currentRefreshToken: refreshToken })
  }

  buildValidators ({ refreshToken }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: refreshToken, fieldName: 'refreshToken' }).required().build()
    ]
  }
}

describe('RefreshToken', () => {
  let refreshToken: string
  let refreshTokenUseCase: jest.Mock
  let sut: RefreshTokenController

  beforeAll(() => {
    refreshToken = 'any_refresh_token'
    refreshTokenUseCase = jest.fn()
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
})
