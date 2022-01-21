import { MongoRoleRepository } from '@/infra/repos/mongo'

export const makeMongoRoleRepository = (): MongoRoleRepository => {
  return new MongoRoleRepository()
}
