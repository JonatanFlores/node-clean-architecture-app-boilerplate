import { LoadLoggedInUser, setupLoadLoggedInUser } from '@/domain/usecases'
import { makeMongoUserRepository } from '@/main/factories/infra/repos/mongo'

export const makeLoadLoggedInUser = (): LoadLoggedInUser => {
  return setupLoadLoggedInUser(
    makeMongoUserRepository()
  )
}
