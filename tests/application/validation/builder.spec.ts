import { EmailValidator, EmailValidatorContract, RequiredStringValidator, ValidationBuilder } from '@/application/validation'

class EmailValidatorSpy implements EmailValidatorContract {
  isValid (): boolean {
    return true
  }
}

describe('ValidationBuilder', () => {
  let emailValidator: EmailValidatorContract

  beforeAll(() => {
    emailValidator = new EmailValidatorSpy()
  })

  test('should return a RequiredStringValidator', () => {
    const validators = ValidationBuilder
      .of({ value: 'any_value', fieldName: 'any_name' })
      .required()
      .build()

    expect(validators).toEqual([new RequiredStringValidator('any_value', 'any_name')])
  })

  test('should return an EmailValidator', () => {
    const validators = ValidationBuilder
      .of({ value: 'any@mail.com', fieldName: 'email' })
      .email()
      .build()

    expect(validators).toEqual([new EmailValidator('any@mail.com', emailValidator)])
  })
})
