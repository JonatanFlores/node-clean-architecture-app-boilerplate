import { mock, MockProxy } from 'jest-mock-extended'

export class EmailValidator {
  constructor (
    private readonly value: string,
    private readonly emailValidator: EmailValidatorContract
  ) {}

  validate (): void {
    this.emailValidator.isValid(this.value)
  }
}

export interface EmailValidatorContract {
  isValid: (email: string) => boolean
}

describe('EmailValidator', () => {
  let email: string
  let emailValidator: MockProxy<EmailValidatorContract>
  let sut: EmailValidator

  beforeAll(() => {
    email = 'any_email'
    emailValidator = mock()
  })

  beforeEach(() => {
    sut = new EmailValidator(email, emailValidator)
  })

  test('should call EmailValidatorContract with correct input', () => {
    sut.validate()

    expect(emailValidator.isValid).toHaveBeenCalledWith(email)
    expect(emailValidator.isValid).toHaveBeenCalledTimes(1)
  })
})
