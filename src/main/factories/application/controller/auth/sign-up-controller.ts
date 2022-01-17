import { SignUpController } from '@/application/controllers'
import { makeAddUserAccount } from '@/main/factories/domain/usecases'

export const makeSignUpController = (): SignUpController => {
  return new SignUpController(makeAddUserAccount())
}
