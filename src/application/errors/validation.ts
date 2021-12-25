export class RequiredFieldError extends Error {
  constructor (fieldName: string) {
    super(`The ${fieldName} is required`)
    this.name = 'RequiredFieldError'
  }
}
