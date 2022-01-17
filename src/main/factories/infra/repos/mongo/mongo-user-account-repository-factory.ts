import { MongoUserAccountRepository } from '@/infra/repos/mongo'

export const makeMongoUserAccountRepository = (): MongoUserAccountRepository => {
  return new MongoUserAccountRepository()
}
