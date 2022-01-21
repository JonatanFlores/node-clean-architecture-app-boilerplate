import { CreateRole, setupCreateRole } from '@/domain/usecases/user'
import { LoadRoleByName, SaveRole } from '@/domain/contracts/repos/mongo'
import { RoleAlreadyExistsError } from '@/domain/entities/errors'

import { mock, MockProxy } from 'jest-mock-extended'

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
