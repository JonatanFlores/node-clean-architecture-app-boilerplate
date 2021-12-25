
class LoginController {
  async handle (httpRequest: any): Promise<HttpResponse> {
    if (httpRequest.email === '' || httpRequest.email === null || httpRequest.email === undefined) {
      return {
        statusCode: 400,
        data: new Error('The email field is required')
      }
    }
    if (httpRequest.password === '' || httpRequest.password === null || httpRequest.password === undefined) {
      return {
        statusCode: 400,
        data: new Error('The password field is required')
      }
    }
  }
}

type HttpResponse = undefined | {
  statusCode: number
  data: any
}

describe('LoginController', () => {
  test('should return 400 if email is empty', async () => {
    const sut = new LoginController()

    const httpResponse = await sut.handle({ email: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The email field is required')
    })
  })

  test('should return 400 if email is null', async () => {
    const sut = new LoginController()

    const httpResponse = await sut.handle({ email: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The email field is required')
    })
  })

  test('should return 400 if email is undefined', async () => {
    const sut = new LoginController()

    const httpResponse = await sut.handle({ email: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The email field is required')
    })
  })

  test('should return 400 if password is empty', async () => {
    const sut = new LoginController()

    const httpResponse = await sut.handle({ email: 'any@mail.com', password: '' })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The password field is required')
    })
  })

  test('should return 400 if password is null', async () => {
    const sut = new LoginController()

    const httpResponse = await sut.handle({ email: 'any@mail.com', password: null })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The password field is required')
    })
  })

  test('should return 400 if password is undefined', async () => {
    const sut = new LoginController()

    const httpResponse = await sut.handle({ email: 'any@mail.com', password: undefined })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new Error('The password field is required')
    })
  })
})
