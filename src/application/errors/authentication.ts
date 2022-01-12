export class TokenExpiredError extends Error {
  constructor () {
    super('token.expired')
    this.name = 'TokenExpiredError'
  }
}

export class TokenInvalidError extends Error {
  constructor () {
    super('token.invalid')
    this.name = 'TokenInvalidError'
  }
}
