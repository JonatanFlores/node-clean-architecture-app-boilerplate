import { ConfirmUserAccountCreation, setupConfirmUserAccountCreation } from '@/domain/usecases'
import { makeMongoUserAccountRepository, makeMongoUserRepository, makeMongoUserTokenRepository } from '@/main/factories/infra/repos/mongo'
import { makeDateFnsAdapter } from '@/main/factories/shared/adapters/datetime'

export const makeConfirmUserAccountCreation = (): ConfirmUserAccountCreation => {
  return setupConfirmUserAccountCreation(
    makeMongoUserRepository(),
    makeMongoUserAccountRepository(),
    makeMongoUserTokenRepository(),
    makeDateFnsAdapter()
  )
}
