export class RoleAlreadyExistsError extends Error {
  constructor (roleName: string) {
    super(`Role ${roleName} already exists`)
    this.name = 'RoleAlreadyExistsError'
  }
}
