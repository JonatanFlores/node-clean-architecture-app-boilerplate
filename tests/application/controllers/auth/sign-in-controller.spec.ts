import { SignInController } from '@/application/controllers'
import { UnauthorizedError, ServerError } from '@/application/errors'
import { AuthenticationError } from '@/domain/entities/errors'
import { RequiredStringValidator } from '@/application/validation'

describe('SignInController', () => {
  let email: string
  let password: string
  let token: string
  let authentication: jest.Mock
  let sut: SignInController

  beforeAll(() => {
    email = 'any_email'
    password = 'any_password'
    token = 'any_token'
    authentication = jest.fn()
    authentication.mockResolvedValue({ accessToken: token })
  })

  beforeEach(() => {
    sut = new SignInController(authentication)
  })

  test('should build Validators correctly', async () => {
    const validators = await sut.buildValidators({ email, password })

    expect(validators).toEqual([
      new RequiredStringValidator(email, 'email'),
      new RequiredStringValidator(password, 'password')
    ])
  })

  test('should call Authentication with correct input', async () => {
    await sut.handle({ email, password })

    expect(authentication).toHaveBeenCalledWith({ email, password })
    expect(authentication).toHaveBeenCalledTimes(1)
  })

  test('should return 401 if authentication fails', async () => {
    authentication.mockRejectedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  test('should return 500 on infra error', async () => {
    const error = new Error('infra_error')
    authentication.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  test('should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { accessToken: token }
    })
  })
})
