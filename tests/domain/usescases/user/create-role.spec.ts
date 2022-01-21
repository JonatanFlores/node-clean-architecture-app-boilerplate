import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (roleRepo: LoadRoleByName & SaveRole) => CreateRole
type Input = { name: string, description: string }
type Output = { id: string, name: string, description: string }
export type CreateRole = (input: Input) => Promise<Output>

export const setupCreateRole: Setup = (roleRepo) => async ({ name, description }) => {
  const role = await roleRepo.loadByName(name)
  if (role !== undefined) throw new RoleAlreadyExistsError(name)
  const createdRole = await roleRepo.save({ name, description })
  return createdRole
}

export interface LoadRoleByName {
  loadByName: (input: LoadRoleByName.Input) => Promise<LoadRoleByName.Output>
}

export namespace LoadRoleByName {
  export type Input = string
  export type Output = { id: string, name: string, description: string }
}

export interface SaveRole {
  save: (input: SaveRole.Input) => Promise<SaveRole.Output>
}

export namespace SaveRole {
  export type Input = { name: string, description: string }
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
  let roleRepo: MockProxy<LoadRoleByName & SaveRole>
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
    roleRepo.save.mockResolvedValue(roleData)
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

  test('should call SaveRole with correct input', async () => {
    await sut({ name, description })

    expect(roleRepo.save).toHaveBeenCalledWith({ name, description })
    expect(roleRepo.save).toHaveBeenCalledTimes(1)
  })

  test('should rethrow if SaveRole throws', async () => {
    const error = new Error('save_role_error')
    roleRepo.save.mockRejectedValueOnce(error)

    const promise = sut({ name, description })

    await expect(promise).rejects.toThrow(error)
  })

  test('should return the created role', async () => {
    const result = await sut({ name, description })

    expect(result).toEqual(roleData)
  })
})
