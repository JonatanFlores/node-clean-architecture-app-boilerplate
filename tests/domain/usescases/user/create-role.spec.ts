import { mock, MockProxy } from 'jest-mock-extended'

type Setup = (roleRepo: LoadRoleByName) => CreateRole
type Input = { name: string, description: string }
export type CreateRole = (input: Input) => Promise<void>

export const setupCreateRole: Setup = (roleRepo) => async ({ name }) => {
  await roleRepo.loadByName(name)
}

export interface LoadRoleByName {
  loadByName: (input: LoadRoleByName.Input) => Promise<void>
}

export namespace LoadRoleByName {
  export type Input = string
}

describe('CreateRole', () => {
  let roleRepo: MockProxy<LoadRoleByName>
  let sut: CreateRole

  beforeAll(() => {
    roleRepo = mock()
  })

  beforeEach(() => {
    sut = setupCreateRole(roleRepo)
  })

  test('should call LoadRoleByName with correct input', async () => {
    await sut({ name: 'any-role', description: 'any role' })

    expect(roleRepo.loadByName).toHaveBeenCalledWith('any-role')
    expect(roleRepo.loadByName).toHaveBeenCalledTimes(1)
  })
})
