import { RequiredStringValidator, ValidationBuilder as Build, Validator } from '@/application/validation'
import { AddUserAccount } from '@/domain/usecases'

type HttpRequest = { email: string, password: string }

class SignupController {
  constructor (private readonly addUserAccount: AddUserAccount) {}

  async handle ({ email, password }: HttpRequest): Promise<void> {
    await this.addUserAccount({ email, password })
  }

  buildValidators ({ email, password }: HttpRequest): Validator[] {
    return [
      ...Build.of({ value: email, fieldName: 'email' }).required().build(),
      ...Build.of({ value: password, fieldName: 'password' }).required().build()
    ]
  }
}

describe('SignupController', () => {
  let email: string
  let password: string
  let addUserAccount: jest.Mock
  let sut: SignupController

  beforeAll(() => {
    email = 'any_email@mail.com'
    password = 'any_password'
    addUserAccount = jest.fn()
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
})
