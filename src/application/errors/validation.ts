export class EmailInvalidError extends Error {
  constructor () {
    super('Invalid email address')
    this.name = 'EmailInvalidError'
  }
}

export class RequiredFieldError extends Error {
  constructor (fieldName: string) {
    super(`The ${fieldName} field is required`)
    this.name = 'RequiredFieldError'
  }
}
