import { CreateRole, setupCreateRole } from '@/domain/usecases'
import { makeMongoRoleRepository } from '@/main/factories/infra/repos/mongo'

export const makeCreateRole = (): CreateRole => {
  return setupCreateRole(makeMongoRoleRepository())
}
