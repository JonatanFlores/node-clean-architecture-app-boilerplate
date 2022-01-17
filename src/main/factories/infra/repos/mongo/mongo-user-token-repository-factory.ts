import { MongoUserTokenRepository } from '@/infra/repos/mongo'

export const makeMongoUserTokenRepository = (): MongoUserTokenRepository => {
  return new MongoUserTokenRepository()
}
