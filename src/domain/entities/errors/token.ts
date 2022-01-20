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

export class ConfirmUserAccountTokenNotFoundError extends Error {
  constructor () {
    super('User account confirmation token is invalid')
    this.name = 'ConfirmUserAccountTokenNotFoundError'
  }
}

export class ConfirmUserAccountTokenExpiredError extends Error {
  constructor () {
    super('Cannot activate user account, because activation token is already expired')
    this.name = 'ConfirmUserAccountTokenExpiredError'
  }
}
