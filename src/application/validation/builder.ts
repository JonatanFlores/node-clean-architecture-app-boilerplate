import { RequiredStringValidator, EmailValidator, Validator } from '@/application/validation'
import { EmailValidatorAdapter } from '@/shared/adapters/validators'

export class ValidationBuilder {
  private constructor (
    private readonly value: string,
    private readonly fieldName: string,
    private readonly validators: Validator[] = []
  ) {}

  static of ({ value, fieldName }: { value: string, fieldName: string }): ValidationBuilder {
    return new ValidationBuilder(value, fieldName)
  }

  required (): ValidationBuilder {
    this.validators.push(new RequiredStringValidator(this.value, this.fieldName))
    return this
  }

  email (): ValidationBuilder {
    const validator = new EmailValidatorAdapter()
    const emailValidator = new EmailValidator(this.value, validator)
    this.validators.push(emailValidator)
    return this
  }

  build (): Validator[] {
    return this.validators
  }
}
