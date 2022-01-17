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
  let sendForgotPasswordEmail: jest.Mock
  let sut: SendForgotPasswordEmailController

  beforeAll(() => {
    email = 'any_email@mail.com'
    sendForgotPasswordEmail = jest.fn()
    emailValidator = new EmailValidatorSpy()
  })

  beforeEach(() => {
    sut = new SendForgotPasswordEmailController(sendForgotPasswordEmail)
  })

  test('should build Validators correctly', () => {
    const validators = sut.buildValidators({ email })

    expect(validators).toEqual([
      new RequiredStringValidator(email, 'email'),
      new EmailValidator(email, emailValidator)
    ])
  })

  test('should call SendForgotPasswordEmail with correct input', async () => {
    await sut.handle({ email })

    expect(sendForgotPasswordEmail).toHaveBeenCalledWith({ email })
    expect(sendForgotPasswordEmail).toHaveBeenCalledTimes(1)
  })

  test('should return 200 if SendForgotPasswordEmail succeeds', async () => {
    const httpResponse = await sut.handle({ email })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: { message: 'Forgot password email was sent, please check your inbox' }
    })
  })
})
