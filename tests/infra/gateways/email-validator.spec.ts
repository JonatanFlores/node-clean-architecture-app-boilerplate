import validator from 'validator'

export class EmailValidator {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}

jest.mock('validator')

describe('EmailValidator', () => {
  let email: string
  let fakeValidator: jest.Mocked<typeof validator>
  let sut: EmailValidator

  beforeAll(() => {
    email = 'any_email@mail.com'
    fakeValidator = validator as jest.Mocked<typeof validator>
    fakeValidator.isEmail.mockImplementation(() => true)
  })

  beforeEach(() => {
    sut = new EmailValidator()
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
