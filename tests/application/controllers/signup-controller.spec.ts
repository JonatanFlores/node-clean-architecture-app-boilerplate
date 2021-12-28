import { RequiredStringValidator, ValidationBuilder as Build, Validator } from '@/application/validation'

type HttpRequest = { email: string, password: string }

class SignupController {
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
  let sut: SignupController

  beforeEach(() => {
    sut = new SignupController()
  })

  test('should build Validators correctly', () => {
    const validators = sut.buildValidators({ email, password })

    expect(validators).toEqual([
      new RequiredStringValidator(email, 'email'),
      new RequiredStringValidator(password, 'password')
    ])
  })
})
