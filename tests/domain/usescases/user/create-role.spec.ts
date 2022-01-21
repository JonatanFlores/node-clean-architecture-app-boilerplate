import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (roleRepo: LoadRoleByName) => CreateRole
type Input = { name: string, description: string }
export type CreateRole = (input: Input) => Promise<void>

export const setupCreateRole: Setup = (roleRepo) => async ({ name }) => {
  const role = await roleRepo.loadByName(name)
  if (role !== undefined) throw new RoleAlreadyExistsError(name)
}

export interface LoadRoleByName {
  loadByName: (input: LoadRoleByName.Input) => Promise<LoadRoleByName.Output>
}

export namespace LoadRoleByName {
  export type Input = string
  export type Output = { id: string, name: string, description: string }
}

export class RoleAlreadyExistsError extends Error {
  constructor (roleName: string) {
    super(`Role ${roleName} already exists`)
    this.name = 'RoleAlreadyExistsError'
  }
}

describe('CreateRole', () => {
  let name: string
  let description: string
  let roleData: LoadRoleByName.Output
  let roleRepo: MockProxy<LoadRoleByName>
  let sut: CreateRole

  beforeAll(() => {
    name = 'any-role'
    description = 'any role'
    roleData = {
      id: 'any_id',
      name: 'any-role',
      description: 'any role'
    }
    roleRepo = mock()
  })

  beforeEach(() => {
    sut = setupCreateRole(roleRepo)
  })

  test('should call LoadRoleByName with correct input', async () => {
    await sut({ name, description })

    expect(roleRepo.loadByName).toHaveBeenCalledWith('any-role')
    expect(roleRepo.loadByName).toHaveBeenCalledTimes(1)
  })

  test('should throw a RoleAlreadyExistsError if LoadRoleByName returns a role', async () => {
    roleRepo.loadByName.mockResolvedValueOnce(roleData)

    const promise = sut({ name, description })

    await expect(promise).rejects.toThrow(new RoleAlreadyExistsError('any-role'))
  })
})
