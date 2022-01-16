import { SendForgotPasswordEmailController } from '@/application/controllers'
import { EmailValidator, EmailValidatorContract, RequiredStringValidator } from '@/application/validation'

class EmailValidatorSpy implements EmailValidatorContract {
  isValid (): boolean {
    return true
  }
}

describe('SendForgotPasswordEmailController', () => {
  let email: string
  let emailValidator: EmailValidatorContract
  let sut: SendForgotPasswordEmailController

  beforeAll(() => {
    email = 'any_email'
    emailValidator = new EmailValidatorSpy()
  })

  beforeEach(() => {
    sut = new SendForgotPasswordEmailController()
  })

  test('should build Validators correctly', () => {
    const validators = sut.buildValidators({ email })

    expect(validators).toEqual([
      new RequiredStringValidator(email, 'email'),
      new EmailValidator(email, emailValidator)
    ])
  })
})
