import { EmailValidatorAdapter } from '@/shared/adapters/validators'

import validator from 'validator'

jest.mock('validator')

describe('EmailValidatorAdapter', () => {
  let email: string
  let fakeValidator: jest.Mocked<typeof validator>
  let sut: EmailValidatorAdapter

  beforeAll(() => {
    email = 'any_email@mail.com'
    fakeValidator = validator as jest.Mocked<typeof validator>
    fakeValidator.isEmail.mockImplementation(() => true)
  })

  beforeEach(() => {
    sut = new EmailValidatorAdapter()
  })

  test('should call validator with correct email', () => {
    sut.isValid(email)

    expect(fakeValidator.isEmail).toHaveBeenCalledWith(email)
    expect(fakeValidator.isEmail).toHaveBeenCalledTimes(1)
  })

  test('should return true if validator returns true', () => {
    const result = sut.isValid(email)

    expect(result).toBe(true)
  })

  test('should return false if validator returns false', () => {
    fakeValidator.isEmail.mockImplementation(() => false)

    const result = sut.isValid(email)

    expect(result).toBe(false)
  })
})
