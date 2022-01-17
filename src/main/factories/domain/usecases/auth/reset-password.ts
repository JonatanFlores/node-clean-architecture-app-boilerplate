import { ResetPassword, setupResetPassword } from '@/domain/usecases'
import { makeDateFnsAdapter } from '@/main/factories/shared/adapters/datetime'
import { makeBcryptAdapter } from '@/main/factories/shared/adapters/security'
import {
  makeMongoUserAccountRepository,
  makeMongoUserRepository,
  makeMongoUserTokenRepository
} from '@/main/factories/infra/repos/mongo'

export const makeResetPassword = (): ResetPassword => {
  return setupResetPassword(
    makeMongoUserTokenRepository(),
    makeMongoUserRepository(),
    makeMongoUserAccountRepository(),
    makeBcryptAdapter(),
    makeDateFnsAdapter()
  )
}
