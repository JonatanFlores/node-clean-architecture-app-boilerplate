import { AddUserAccount, setupAddUserAccount } from '@/domain/usecases'
import { makeMongoUserAccountRepository, makeMongoUserTokenRepository } from '@/main/factories/infra/repos/mongo'
import { makeBcryptAdapter, makeJwtAdapter } from '@/main/factories/shared/adapters/security'
import { makeMailerAdapter } from '@/main/factories/shared/adapters/mail'

export const makeAddUserAccount = (): AddUserAccount => {
  return setupAddUserAccount(
    makeMongoUserAccountRepository(),
    makeMongoUserTokenRepository(),
    makeBcryptAdapter(),
    makeJwtAdapter(),
    makeMailerAdapter()
  )
}
