export class AuthenticationError extends Error {
  constructor () {
    super('Invalid email or password')
    this.name = 'AuthenticationError'
  }
}

export class RefreshTokenError extends Error {
  constructor () {
    super('Invalid refresh token')
    this.name = 'RefreshTokenError'
  }
}
