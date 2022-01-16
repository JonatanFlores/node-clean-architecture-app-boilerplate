import { EmailValidatorContract, EmailValidator } from '@/application/validation'
import { EmailInvalidError } from '@/application/errors'

import { mock, MockProxy } from 'jest-mock-extended'

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

  test('should return undefined if email is valid', () => {
    const result = sut.validate()

    expect(result).toBeUndefined()
  })
})
