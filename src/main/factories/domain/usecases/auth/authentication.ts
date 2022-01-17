import { Authentication, setupAuthentication } from '@/domain/usecases'
import { makeMongoUserAccountRepo } from '@/main/factories/infra/repos/mongo'
import { makeBcryptHashHandler, makeJwtTokenHandler } from '@/main/factories/shared/adapters/security'

export const makeAuthentication = (): Authentication => {
  return setupAuthentication(
    makeMongoUserAccountRepo(),
    makeBcryptHashHandler(),
    makeJwtTokenHandler()
  )
}
