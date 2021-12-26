import { Authentication, setupAuthentication } from '@/domain/usecases'
import { makeMongoUserAccountRepo } from '@/main/factories/infra/repos/mongo'
import { makeBcryptHashHandler, makeJwtTokenHandler } from '@/main/factories/infra/gateways'

export const makeAuthentication = (): Authentication => {
  return setupAuthentication(
    makeMongoUserAccountRepo(),
    makeBcryptHashHandler(),
    makeJwtTokenHandler()
  )
}
