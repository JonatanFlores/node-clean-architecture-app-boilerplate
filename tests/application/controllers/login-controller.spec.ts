import { AuthenticationError } from '@/domain/entities/errors'
import { Authentication } from '@/domain/usecases'

export class LoginController {
  constructor (private readonly authentication: Authentication) {}

  async handle ({ email, password }: any): Promise<HttpResponse> {
    if (email === '' || email === null || email === undefined) {
      return {
        statusCode: 400,
        data: new Error('The email field is required')
      }
    }
    if (password === '' || password === null || password === undefined) {
      return {
        statusCode: 400,
        data: new Error('The password field is required')
      }
    }
    const result = await this.authentication({ email, password })
    return {
      statusCode: 401,
      data: result
    }
  }
}

export type HttpResponse = undefined | {
  statusCode: number
  data: any
}

describe('LoginController', () => {
  let authentication: jest.Mock
  let sut: LoginController

  beforeAll(() => {
    authentication = jest.fn()
  })

  beforeEach(() => {
    sut = new LoginController(authentication)
  })

  test('should return 400 if email is empty', async () => {
    const httpResponse = await sut.handle({ email: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The email field is required')
    })
  })

  test('should return 400 if email is null', async () => {
    const httpResponse = await sut.handle({ email: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The email field is required')
    })
  })

  test('should return 400 if email is undefined', async () => {
    const httpResponse = await sut.handle({ email: undefined })

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
    const httpResponse = await sut.handle({ email: 'any@mail.com', password: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The password field is required')
    })
  })

  test('should return 400 if password is undefined', async () => {
    const httpResponse = await sut.handle({ email: 'any@mail.com', password: undefined })

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
    authentication.mockResolvedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ email: 'any@mail.com', password: 'any_password' })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new AuthenticationError()
    })
  })
})
