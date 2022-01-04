import { MongoUser } from '@/infra/repos/mongo'

export const makeMongoUserRepo = (): MongoUser => {
  return new MongoUser()
}
