export class AuthenticationError extends Error {
  constructor () {
    super('Invalid email or password')
    this.name = 'AuthenticationError'
  }
}
