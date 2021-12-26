import { MongoUserAccount } from '@/infra/repos/mongo'

export const makeMongoUserAccountRepo = (): MongoUserAccount => {
  return new MongoUserAccount()
}
