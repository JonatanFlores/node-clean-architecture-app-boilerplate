import { LoadLoggedInUser, setupLoadLoggedInUser } from '@/domain/usecases'
import { makeMongoUserRepo } from '@/main/factories/infra/repos/mongo'

export const makeLoadLoggedInUser = (): LoadLoggedInUser => {
  return setupLoadLoggedInUser(
    makeMongoUserRepo()
  )
}
