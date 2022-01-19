import { Authentication, setupAuthentication } from '@/domain/usecases'
import { makeMongoUserAccountRepository } from '@/main/factories/infra/repos/mongo'
import { makeBcryptAdapter, makeJwtAdapter } from '@/main/factories/shared/adapters/security'

export const makeAuthentication = (): Authentication => {
  return setupAuthentication(
    makeMongoUserAccountRepository(),
    makeBcryptAdapter(),
    makeJwtAdapter()
  )
}
