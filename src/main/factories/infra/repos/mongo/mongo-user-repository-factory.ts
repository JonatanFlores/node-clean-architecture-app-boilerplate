import { MongoUserRepository } from '@/infra/repos/mongo'

export const makeMongoUserRepository = (): MongoUserRepository => {
  return new MongoUserRepository()
}
