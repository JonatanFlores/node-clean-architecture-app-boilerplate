import validator from 'validator'

export class EmailValidator {
  isValid (email: string): void {
    validator.isEmail(email)
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
  })

  beforeEach(() => {
    sut = new EmailValidator()
  })

  test('should call validator with correct email', () => {
    sut.isValid(email)

    expect(fakeValidator.isEmail).toHaveBeenCalledWith(email)
    expect(fakeValidator.isEmail).toHaveBeenCalledTimes(1)
  })
})
