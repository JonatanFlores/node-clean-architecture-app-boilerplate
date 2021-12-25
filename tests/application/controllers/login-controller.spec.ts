import { LoginController } from '@/application/controllers'
import { UnauthorizedError, ServerError } from '@/application/errors'
import { AuthenticationError } from '@/domain/entities/errors'
import { RequiredStringValidator } from '@/application/validation'

import { mocked } from 'ts-jest/utils'

jest.mock('@/application/validation/required-string')

describe('LoginController', () => {
  let email: string
  let password: string
  let token: string
  let authentication: jest.Mock
  let sut: LoginController

  beforeAll(() => {
    email = 'any_email'
    password = 'any_password'
    token = 'any_token'
    authentication = jest.fn()
    authentication.mockResolvedValue({ accessToken: token })
  })

  beforeEach(() => {
    sut = new LoginController(authentication)
  })

  test('should return 400 if validation fails', async () => {
    const error = new Error('validation_error')
    const RequiredStringValidatorSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    mocked(RequiredStringValidator).mockImplementationOnce(RequiredStringValidatorSpy)

    const httpResponse = await sut.handle({ email, password })

    expect(RequiredStringValidator).toHaveBeenCalledWith(email, 'email')
    expect(httpResponse).toEqual({
      statusCode: 400,
      data: error
    })
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
