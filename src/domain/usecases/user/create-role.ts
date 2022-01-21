import { LoadRoleByName, SaveRole } from '@/domain/contracts/repos/mongo'
import { RoleAlreadyExistsError } from '@/domain/entities/errors'

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
