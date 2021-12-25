import { AuthenticationError } from '@/domain/entities/errors'
import { Authentication } from '@/domain/usecases'

export class LoginController {
  constructor (private readonly authentication: Authentication) {}

  async handle ({ email, password }: any): Promise<HttpResponse> {
    if (email === '' || email === null || email === undefined) {
      return badRequest(new Error('The email field is required'))
    }
    if (password === '' || password === null || password === undefined) {
      return badRequest(new Error('The password field is required'))
    }
    try {
      const accessToken = await this.authentication({ email, password })
      return ok(accessToken)
    } catch (error) {
      if (error instanceof AuthenticationError) return unauthorized()
      throw error
    }
  }
}

export type HttpResponse<T = any> = {
  statusCode: number
  data: T
}

export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}

export const ok = <T = any> (data: T): HttpResponse<T> => ({
  statusCode: 200,
  data
})

export const badRequest = (error: Error): HttpResponse<Error> => ({
  statusCode: 400,
  data: error
})

export const unauthorized = (): HttpResponse<Error> => ({
  statusCode: 401,
  data: new UnauthorizedError()
})

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
    authentication.mockRejectedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ email: 'any@mail.com', password: 'any_password' })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
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
