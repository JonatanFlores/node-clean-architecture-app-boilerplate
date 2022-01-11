import { AddUserAccount, setupAddUserAccount } from '@/domain/usecases'
import { makeBcryptHashHandler, makeJwtTokenHandler } from '@/main/factories/infra/gateways'
import { makeMongoUserAccountRepo } from '@/main/factories/infra/repos/mongo'

export const makeAddUserAccount = (): AddUserAccount => {
  return setupAddUserAccount(
    makeMongoUserAccountRepo(),
    makeBcryptHashHandler(),
    makeJwtTokenHandler()
  )
}
