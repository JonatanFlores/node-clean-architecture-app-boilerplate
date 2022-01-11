import { SignupController } from '@/application/controllers'
import { makeAddUserAccount } from '@/main/factories/domain/usecases'

export const makeSignupController = (): SignupController => {
  return new SignupController(makeAddUserAccount())
}
