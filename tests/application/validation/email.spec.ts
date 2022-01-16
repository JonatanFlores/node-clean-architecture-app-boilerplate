import { EmailInvalidError } from '@/application/errors'

import { mock, MockProxy } from 'jest-mock-extended'

export class EmailValidator {
  constructor (
    private readonly value: string,
    private readonly emailValidator: EmailValidatorContract
  ) {}

  validate (): Error | undefined {
    if (!this.emailValidator.isValid(this.value)) {
      return new EmailInvalidError()
    }
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
    emailValidator.isValid.mockReturnValue(true)
  })

  beforeEach(() => {
    sut = new EmailValidator(email, emailValidator)
  })

  test('should call EmailValidatorContract with correct input', () => {
    sut.validate()

    expect(emailValidator.isValid).toHaveBeenCalledWith(email)
    expect(emailValidator.isValid).toHaveBeenCalledTimes(1)
  })

  test('should return EmailInvalidError if isValid return false', () => {
    emailValidator.isValid.mockReturnValueOnce(false)

    const result = sut.validate()

    expect(result).toBeInstanceOf(EmailInvalidError)
  })
})
