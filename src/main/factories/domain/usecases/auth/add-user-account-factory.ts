import { AddUserAccount, setupAddUserAccount } from '@/domain/usecases'
import { makeBcryptAdapter, makeJwtAdapter } from '@/main/factories/shared/adapters/security'
import { makeMongoUserAccountRepository } from '@/main/factories/infra/repos/mongo'

export const makeAddUserAccount = (): AddUserAccount => {
  return setupAddUserAccount(
    makeMongoUserAccountRepository(),
    makeBcryptAdapter(),
    makeJwtAdapter()
  )
}
