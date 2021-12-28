import { Controller } from '@/application/controllers'
import { RequiredStringValidator, ValidationBuilder as Build, Validator } from '@/application/validation'
import { HttpResponse, ok } from '@/application/helpers'
import { AddUserAccount } from '@/domain/usecases'

type HttpRequest = { email: string, password: string }
type Model = Error | { email: string, accessToken: string }

class SignupController extends Controller {
  constructor (private readonly addUserAccount: AddUserAccount) {
    super()
  }

  async perform ({ email, password }: HttpRequest): Promise<HttpResponse<Model>> {
    const result = await this.addUserAccount({ email, password })
    return ok(result)
  }

  override buildValidators ({ email, password }: HttpRequest): Validator[] {
    return [
      ...Build.of({ value: email, fieldName: 'email' }).required().build(),
      ...Build.of({ value: password, fieldName: 'password' }).required().build()
    ]
  }
}

describe('SignupController', () => {
  let email: string
  let password: string
  let accessToken: string
  let addUserAccount: jest.Mock
  let sut: SignupController

  beforeAll(() => {
    email = 'any_email@mail.com'
    password = 'any_password'
    accessToken = 'any_access_token'
    addUserAccount = jest.fn()
    addUserAccount.mockResolvedValue({ email, accessToken })
  })

  beforeEach(() => {
    sut = new SignupController(addUserAccount)
  })

  test('should build Validators correctly', () => {
    const validators = sut.buildValidators({ email, password })

    expect(validators).toEqual([
      new RequiredStringValidator(email, 'email'),
      new RequiredStringValidator(password, 'password')
    ])
  })

  test('should call AddUserAccount with correct input', async () => {
    await sut.handle({ email, password })

    expect(addUserAccount).toHaveBeenCalledWith({ email, password })
    expect(addUserAccount).toHaveBeenCalledTimes(1)
  })

  test('should return 200 if AddUserAccount succeeds', async () => {
    const httpResponse = await sut.handle({ email, password })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { accessToken, email }
    })
  })
})
