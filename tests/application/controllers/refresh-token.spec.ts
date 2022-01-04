import { RequiredStringValidator, Validator, ValidationBuilder as Builder } from '@/application/validation'

type HttpRequest = { refreshToken: string }

class RefreshTokenController {
  buildValidators ({ refreshToken }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: refreshToken, fieldName: 'refreshToken' }).required().build()
    ]
  }
}

describe('RefreshToken', () => {
  let refreshToken: string
  let sut: RefreshTokenController

  beforeAll(() => {
    refreshToken = 'any_refresh_token'
  })

  beforeEach(() => {
    sut = new RefreshTokenController()
  })

  test('should build Validators correctly', () => {
    const validators = sut.buildValidators({ refreshToken: 'any_refresh_token' })

    expect(validators).toEqual([
      new RequiredStringValidator(refreshToken, 'refreshToken')
    ])
  })
})
