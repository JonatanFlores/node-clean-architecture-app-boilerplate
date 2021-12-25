import { LoginController } from '@/application/controllers'
import { UnauthorizedError, ServerError } from '@/application/errors'
import { AuthenticationError } from '@/domain/entities/errors'

describe('LoginController', () => {
  let authentication: jest.Mock
  let sut: LoginController

  beforeAll(() => {
    authentication = jest.fn()
    authentication.mockResolvedValue({ accessToken: 'any_value' })
  })

  beforeEach(() => {
    sut = new LoginController(authentication)
  })

  test('should return 400 if email is empty', async () => {
    const httpResponse = await sut.handle({ email: '', password: 'any_password' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The email field is required')
    })
  })

  test('should return 400 if email is null', async () => {
    const httpResponse = await sut.handle({ email: null as any, password: 'any_password' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The email field is required')
    })
  })

  test('should return 400 if email is undefined', async () => {
    const httpResponse = await sut.handle({ email: undefined as any, password: 'any_password' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The email field is required')
    })
  })

  test('should return 400 if password is empty', async () => {
    const httpResponse = await sut.handle({ email: 'any@mail.com', password: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The password field is required')
    })
  })

  test('should return 400 if password is null', async () => {
    const httpResponse = await sut.handle({ email: 'any@mail.com', password: null as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The password field is required')
    })
  })

  test('should return 400 if password is undefined', async () => {
    const httpResponse = await sut.handle({ email: 'any@mail.com', password: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The password field is required')
    })
  })

  test('should call Authentication with correct input', async () => {
    await sut.handle({ email: 'any@mail.com', password: 'any_password' })

    expect(authentication).toHaveBeenCalledWith({ email: 'any@mail.com', password: 'any_password' })
    expect(authentication).toHaveBeenCalledTimes(1)
  })

  test('should return 401 if authentication fails', async () => {
    authentication.mockRejectedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ email: 'any@mail.com', password: 'any_password' })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  test('should return 500 on infra error', async () => {
    const error = new Error('infra_error')
    authentication.mockRejectedValueOnce(error)

    const httpResponse = await sut.handle({ email: 'any@mail.com', password: 'any_password' })

    expect(httpResponse).toEqual({
      statusCode: 500,
      data: new ServerError(error)
    })
  })

  test('should return 200 if authentication succeeds', async () => {
    const httpResponse = await sut.handle({ email: 'any@mail.com', password: 'any_password' })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { accessToken: 'any_value' }
    })
  })
})
