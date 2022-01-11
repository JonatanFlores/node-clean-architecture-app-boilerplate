export class ServerError extends Error {
  constructor (error?: Error) {
    super('Server failed. Try again soon')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}

export class UnauthorizedError extends Error {
  constructor () {
    super('Unauthorized')
    this.name = 'UnauthorizedError'
  }
}

export class ForbiddenError extends Error {
  constructor () {
    super('Access denied')
    this.name = 'ForbiddenError'
  }
}

export class NotFoundError extends Error {
  constructor () {
    super('Resource Not found')
    this.name = 'NotFoundError'
  }
}
