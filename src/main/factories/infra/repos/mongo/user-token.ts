import { MongoUserToken } from '@/infra/repos/mongo'

export const makeMongoUserTokenRepo = (): MongoUserToken => {
  return new MongoUserToken()
}
