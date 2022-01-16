export interface Validator {
  validate: () => Error | undefined
}

export interface EmailValidatorContract {
  isValid: (email: string) => boolean
}
