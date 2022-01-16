import { EmailValidatorContract, Validator } from '@/application/validation'
import { EmailInvalidError } from '@/application/errors'

export class EmailValidator implements Validator {
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
