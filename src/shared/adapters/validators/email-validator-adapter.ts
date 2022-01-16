import { EmailValidatorContract } from '@/application/validation'

import validator from 'validator'

export class EmailValidatorAdapter implements EmailValidatorContract {
  isValid (email: string): boolean {
    return validator.isEmail(email)
  }
}
