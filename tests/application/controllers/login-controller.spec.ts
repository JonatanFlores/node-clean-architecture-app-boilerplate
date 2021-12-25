
class LoginController {
  async handle (httpRequest: any): Promise<HttpResponse> {
    return {
      statusCode: 400,
      data: new Error('The email field is required')
    }
  }
}

type HttpResponse = {
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
})
