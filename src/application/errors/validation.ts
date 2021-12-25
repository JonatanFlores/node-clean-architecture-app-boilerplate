export class RequiredFieldError extends Error {
  constructor (fieldName: string) {
    super(`The ${fieldName} field is required`)
    this.name = 'RequiredFieldError'
  }
}
