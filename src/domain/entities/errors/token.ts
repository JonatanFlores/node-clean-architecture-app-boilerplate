export class ResetPasswordTokenNotFoundError extends Error {
  constructor () {
    super('Reset password token not found')
    this.name = 'ResetPasswordTokenNotFoundError'
  }
}

export class ResetPasswordTokenExpiredError extends Error {
  constructor () {
    super('Reset password token expired')
    this.name = 'ResetPasswordTokenExpiredError'
  }
}
